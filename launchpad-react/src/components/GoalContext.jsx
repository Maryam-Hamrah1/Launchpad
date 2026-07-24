import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./AuthContext";

export const GoalContext = createContext();

const DAYS_PER_MONTH = 30;

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

function buildBlankDays() {
  return Array.from({ length: DAYS_PER_MONTH }, (_, i) => ({
    index: i + 1,
    completed: false,
  }));
}

export function GoalProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, [user]);

  async function fetchGoals() {
    if (!user) {
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

  // Updates a draft's form fields. Pass activate:true to also flip it to
  // "active" status (used when finishing edit + generating a roadmap).
  async function updateGoalFields(id, form, { activate } = {}) {
    const row = mapFormToRow(form, activate ? "active" : "draft", user.id);

    const { data, error } = await supabase
      .from("goals")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update goal:", error.message);
      return null;
    }

    setGoals((prev) => prev.map((g) => (g.id === id ? data : g)));
    return data;
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

    // Ensure every month always has a 30-day list, even if the
    // worker hasn't been updated yet to return one.
    const detailWithDays = {
      ...detail,
      days:
        Array.isArray(detail.days) && detail.days.length > 0
          ? detail.days
          : buildBlankDays(),
    };

    const updatedMonths = goal.roadmap.months.map((m) =>
      m.index === monthIndex ? { ...m, detail: detailWithDays } : m
    );
    const updatedRoadmap = { ...goal.roadmap, months: updatedMonths };

    return saveRoadmap(goal.id, updatedRoadmap);
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

  // Deep-updates a single day inside months -> days.
  function updateDayInRoadmap(roadmap, monthIndex, dayIndex, updateFn) {
    const updatedMonths = roadmap.months.map((m) => {
      if (m.index !== monthIndex) return m;
      const updatedDays = (m.detail?.days || []).map((d) =>
        d.index === dayIndex ? updateFn(d) : d
      );
      return { ...m, detail: { ...m.detail, days: updatedDays } };
    });
    return { ...roadmap, months: updatedMonths };
  }

  async function toggleDayCompletion(goalId, monthIndex, dayIndex) {
    const goal = goals.find((g) => String(g.id) === String(goalId));
    if (!goal?.roadmap) return null;

    const monthIdx = goal.roadmap.months.findIndex((m) => m.index === monthIndex);
    if (monthIdx === -1) return null;

    const targetDay = goal.roadmap.months[monthIdx].detail?.days?.find(
      (d) => d.index === dayIndex
    );
    const nextCompleted = !targetDay?.completed;

    let updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, dayIndex, (d) => ({
      ...d,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : null,
    }));

    // If every day in this month is now complete, mark the month
    // completed and unlock the next one.
    const month = updatedRoadmap.months[monthIdx];
    const days = month.detail?.days || [];
    const allDone = days.length > 0 && days.every((d) => d.completed);

    updatedRoadmap = {
      ...updatedRoadmap,
      months: updatedRoadmap.months.map((m, i) => {
        if (i === monthIdx) {
          return { ...m, status: allDone ? "completed" : "current" };
        }
        if (allDone && m.index === monthIndex + 1 && m.status === "locked") {
          return { ...m, status: "current" };
        }
        return m;
      }),
    };

    return saveRoadmap(goalId, updatedRoadmap);
  }

  async function generateDayDetail(goal, monthIndex, dayIndex) {
    const month = goal.roadmap.months.find((m) => m.index === monthIndex);
    const day = month.detail.days.find((d) => d.index === dayIndex);

    const res = await fetch(`${WORKER_URL}/day`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, month, day }),
    });

    if (!res.ok) {
      console.error("Day detail generation failed:", await res.text());
      return null;
    }

    const { detail } = await res.json();

    const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, dayIndex, (d) => ({
      ...d,
      detail,
    }));

    return saveRoadmap(goal.id, updatedRoadmap);
  }

  async function toggleDayTask(goal, monthIndex, dayIndex, taskId) {
    const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, dayIndex, (d) => ({
      ...d,
      detail: {
        ...d.detail,
        tasks: d.detail.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
      },
    }));

    return saveRoadmap(goal.id, updatedRoadmap);
  }

  async function saveDayNotes(goal, monthIndex, dayIndex, notes) {
    const updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, dayIndex, (d) => ({
      ...d,
      detail: { ...d.detail, notes },
    }));

    return saveRoadmap(goal.id, updatedRoadmap);
  }

  async function completeDay(goal, monthIndex, dayIndex) {
    let updatedRoadmap = updateDayInRoadmap(goal.roadmap, monthIndex, dayIndex, (d) => ({
      ...d,
      completed: true,
      completedAt: new Date().toISOString(),
    }));

    const monthIdx = updatedRoadmap.months.findIndex((m) => m.index === monthIndex);
    const days = updatedRoadmap.months[monthIdx].detail?.days || [];
    const allDone = days.length > 0 && days.every((d) => d.completed);

    updatedRoadmap = {
      ...updatedRoadmap,
      months: updatedRoadmap.months.map((m, i) => {
        if (i === monthIdx) {
          return { ...m, status: allDone ? "completed" : "current" };
        }
        if (allDone && m.index === monthIndex + 1 && m.status === "locked") {
          return { ...m, status: "current" };
        }
        return m;
      }),
    };

    return saveRoadmap(goal.id, updatedRoadmap);
  }

  async function generateProgressFeedback(goalsSummary) {
    const res = await fetch(`${WORKER_URL}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalsSummary }),
    });

    if (!res.ok) {
      console.error("Progress feedback failed:", await res.text());
      return null;
    }

    const { feedback } = await res.json();
    return feedback;
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
        updateGoalFields,
        generateRoadmap,
        generateMonthDetail,
        toggleDayCompletion,
        generateDayDetail,
        toggleDayTask,
        saveDayNotes,
        completeDay,
        generateProgressFeedback,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}