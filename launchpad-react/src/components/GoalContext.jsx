import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import {AuthContext} from "./AuthContext"

export const GoalContext = createContext();



function mapFormToRow(form, status, userId) {
  return {
    user_id: userId,
    title: form.goalTitle,
    category: form.goalCategory,
    description: form.goalDescription,
    experience_level: form.experienceLevel,
    timeline: form.timeline,
    study_hours: form.studyHours,
    learning_style: form.learningStyle,
    priority: form.goalPriority,
    motivation: form.motivation,
    ai_options: form.aiOptions,
    progress: 0,
    status,
  };
}

export function GoalProvider({ children }) {

  const {user} = useContext(AuthContext);

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, [user]);

  async function fetchGoals() {
    if(!user){
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch goals:", error.message);
    } else {
      setGoals(data);
    }
    setLoading(false);
  }

  async function createGoal(form) {
    const row = mapFormToRow(form, "active", user.id);
    const { data, error } = await supabase
      .from("goals")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Failed to create goal:", error.message);
      return null;
    }
    setGoals((prev) => [data, ...prev]);
    return data;
  }

  async function saveDraft(form) {
    const row = mapFormToRow(form, "draft", user.id);
    const { data, error } = await supabase
      .from("goals")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Failed to save draft:", error.message);
      return null;
    }
    setGoals((prev) => [data, ...prev]);
    return data;
  }

  async function promoteDraft(id) {
    const { data, error } = await supabase
      .from("goals")
      .update({ status: "active" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to promote draft:", error.message);
      return;
    }
    setGoals((prev) => prev.map((g) => (g.id === id ? data : g)));
  }

  async function deleteGoal(id) {
    const { error } = await supabase.from("goals").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete goal:", error.message);
      return;
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  const activeGoals = goals.filter((g) => g.status === "active");
  const drafts = goals.filter((g) => g.status === "draft");
const WORKER_URL = "https://launchpad-worker.maryam-ai.workers.dev";

  async function generateRoadmap(goal) {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });

    if (!res.ok) {
      console.error("Roadmap generation failed:", await res.text());
      return null;
    }

    const { roadmap } = await res.json();

    const { data, error } = await supabase
      .from("goals")
      .update({ roadmap })
      .eq("id", goal.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to save roadmap:", error.message);
      return null;
    }

    setGoals((prev) => prev.map((g) => (g.id === goal.id ? data : g)));
    return data;
  }
  

async function generateMonthDetail(goal, monthIndex) {
  const month = goal.roadmap.months.find((m) => m.index === monthIndex);

  const res = await fetch(`${WORKER_URL}/month`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, month }),
  });

  if (!res.ok) {
    console.error("Month detail generation failed:", await res.text());
    return null;
  }

  const { detail } = await res.json();

  const updatedMonths = goal.roadmap.months.map((m) =>
    m.index === monthIndex ? { ...m, detail } : m
  );
  const updatedRoadmap = { ...goal.roadmap, months: updatedMonths };

  const { data, error } = await supabase
    .from("goals")
    .update({ roadmap: updatedRoadmap })
    .eq("id", goal.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to save month detail:", error.message);
    return null;
  }

  setGoals((prev) => prev.map((g) => (g.id === goal.id ? data : g)));
  return data;
}

async function generateWeekDetail(goal, monthIndex, weekIndex) {
  const month = goal.roadmap.months.find((m) => m.index === monthIndex);
  const week = month.detail.weeks.find((w) => w.index === weekIndex);

  const res = await fetch(`${WORKER_URL}/week`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, month, week }),
  });

  if (!res.ok) {
    console.error("Week detail generation failed:", await res.text());
    return null;
  }

  const { detail } = await res.json();

  const updatedRoadmap = updateWeekInRoadmap(goal.roadmap, monthIndex, weekIndex, (w) => ({
    ...w,
    detail,
  }));

  return saveRoadmap(goal.id, updatedRoadmap);
}

async function toggleChecklistItem(goal, monthIndex, weekIndex, itemId) {
  const updatedRoadmap = updateWeekInRoadmap(goal.roadmap, monthIndex, weekIndex, (w) => ({
    ...w,
    detail: {
      ...w.detail,
      checklist: w.detail.checklist.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      ),
    },
  }));

  return saveRoadmap(goal.id, updatedRoadmap);
}

function updateWeekInRoadmap(roadmap, monthIndex, weekIndex, updateFn) {
  const updatedMonths = roadmap.months.map((m) => {
    if (m.index !== monthIndex) return m;
    const updatedWeeks = m.detail.weeks.map((w) =>
      w.index === weekIndex ? updateFn(w) : w
    );
    return { ...m, detail: { ...m.detail, weeks: updatedWeeks } };
  });
  return { ...roadmap, months: updatedMonths };
}

async function saveRoadmap(goalId, roadmap) {
  const { data, error } = await supabase
    .from("goals")
    .update({ roadmap })
    .eq("id", goalId)
    .select()
    .single();

  if (error) {
    console.error("Failed to save roadmap:", error.message);
    return null;
  }

  setGoals((prev) => prev.map((g) => (g.id === goalId ? data : g)));
  return data;
}

async function completeWeek(goal, monthIndex, weekIndex) {
  const monthIdx = goal.roadmap.months.findIndex((m) => m.index === monthIndex);
  const month = { ...goal.roadmap.months[monthIdx] };
  const totalWeeks = month.detail.weeks.length;
  const isLastWeek = weekIndex === totalWeeks;

  const updatedWeeks = month.detail.weeks.map((w) => {
    if (w.index === weekIndex) return { ...w, status: "completed" };
    if (w.index === weekIndex + 1 && w.status === "locked") return { ...w, status: "current" };
    return w;
  });

  month.detail = { ...month.detail, weeks: updatedWeeks };
  if (isLastWeek) month.status = "completed";

  const updatedMonths = goal.roadmap.months.map((m, i) => {
    if (i === monthIdx) return month;
    if (isLastWeek && m.index === monthIndex + 1 && m.status === "locked") {
      return { ...m, status: "current" };
    }
    return m;
  });

  const updatedRoadmap = { ...goal.roadmap, months: updatedMonths };
  return saveRoadmap(goal.id, updatedRoadmap);
}

// Add these functions inside GoalProvider, below completeWeek.
// Also add generateDayDetail, toggleDayTask, saveDayNotes, and completeDay
// to the value={{ ... }} object.

async function generateDayDetail(goal, monthIndex, weekIndex, dayIndex) {
  const month = goal.roadmap.months.find((m) => m.index === monthIndex);
  const week = month.detail.weeks.find((w) => w.index === weekIndex);
  const day = week.detail.days.find((d) => d.index === dayIndex);

  const res = await fetch(`${WORKER_URL}/day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, week, day }),
  });

  if (!res.ok) {
    console.error("Day detail generation failed:", await res.text());
    return null;
  }

  const { detail } = await res.json();

  const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, weekIndex, dayIndex, (d) => ({
    ...d,
    detail,
  }));

  return saveRoadmap(goal.id, updatedRoadmap);
}

async function toggleDayTask(goal, monthIndex, weekIndex, dayIndex, taskId) {
  const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, weekIndex, dayIndex, (d) => ({
    ...d,
    detail: {
      ...d.detail,
      tasks: d.detail.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    },
  }));

  return saveRoadmap(goal.id, updatedRoadmap);
}

async function saveDayNotes(goal, monthIndex, weekIndex, dayIndex, notes) {
  const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, weekIndex, dayIndex, (d) => ({
    ...d,
    detail: { ...d.detail, notes },
  }));

  return saveRoadmap(goal.id, updatedRoadmap);
}

async function completeDay(goal, monthIndex, weekIndex, dayIndex) {
  const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, weekIndex, dayIndex, (d) => ({
    ...d,
    status: "completed",
    completedAt: new Date().toISOString(),
  }));

  const monthIdx = updatedRoadmap.months.findIndex((m) => m.index === monthIndex);
  const weekIdx = updatedRoadmap.months[monthIdx].detail.weeks.findIndex((w) => w.index === weekIndex);
  const days = updatedRoadmap.months[monthIdx].detail.weeks[weekIdx].detail.days.map((d) =>
    d.index === dayIndex + 1 && d.status === "locked" ? { ...d, status: "current" } : d
  );
  updatedRoadmap.months[monthIdx].detail.weeks[weekIdx].detail.days = days;

  return saveRoadmap(goal.id, updatedRoadmap);
}

// Shared helper: deep-updates one day inside months->weeks->days.
function updateDayInRoadmap(roadmap, monthIndex, weekIndex, dayIndex, updateFn) {
  const updatedMonths = roadmap.months.map((m) => {
    if (m.index !== monthIndex) return m;
    const updatedWeeks = m.detail.weeks.map((w) => {
      if (w.index !== weekIndex) return w;
      const updatedDays = w.detail.days.map((d) =>
        d.index === dayIndex ? updateFn(d) : d
      );
      return { ...w, detail: { ...w.detail, days: updatedDays } };
    });
    return { ...m, detail: { ...m.detail, weeks: updatedWeeks } };
  });
  return { ...roadmap, months: updatedMonths };
}

  return (
    <GoalContext.Provider
      value={{
        goals,
        activeGoals,
        drafts,
        loading,
        createGoal,
        saveDraft,
        promoteDraft,
        deleteGoal,
        generateRoadmap,
        generateMonthDetail,
        generateWeekDetail,
        toggleChecklistItem,
        completeWeek,
        generateDayDetail,
        toggleDayTask,
        saveDayNotes,
        completeDay,
        
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}
