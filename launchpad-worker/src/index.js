const CORS_HEADERS = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': 'POST, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
 async fetch(request, env) {
  if (request.method === 'OPTIONS') {
   return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
   return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);

  try {
   if (url.pathname === "/chat") {
  return await handleChatRequest(request, env);
}
   if (url.pathname === '/day') {
   return await handleDayRequest(request, env);
  }
   if (url.pathname === '/month') {
    return await handleMonthRequest(request, env);
   }
   if (url.pathname === '/progress') {
    return await handleProgressRequest(request, env);
   }
   
   // default route ("/") = full roadmap skeleton
   return await handleRoadmapRequest(request, env);
  } catch (err) {
   return new Response(JSON.stringify({ error: err.message }), {
    status: 500,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
   });
  }
 },
};

async function handleRoadmapRequest(request, env) {
 const goal = await request.json();
 const totalMonths = parseInt(goal.timeline, 10) || 6;

 const embeddingInput = `${goal.title}. ${goal.category}. ${goal.description || ''}`;
 const embedding = await getEmbedding(embeddingInput, env.OPENROUTER_API_KEY);
 const resources = await matchResources(embedding, goal.category, env);
 const months = await generateMonthSkeleton(goal, totalMonths, resources, env.OPENROUTER_API_KEY);

 const roadmap = {
  months: months.map((m, i) => ({
   index: m.index,
   title: m.title,
   status: i === 0 ? 'current' : 'locked',
   detail: null,
  })),
 };

 return new Response(JSON.stringify({ roadmap }), {
  headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
 });
}

async function getEmbedding(text, apiKey) {
 const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
  method: 'POST',
  headers: {
   Authorization: `Bearer ${apiKey}`,
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({ model: 'openai/text-embedding-3-small', input: text }),
 });
 if (!res.ok) throw new Error(`Embedding failed: ${await res.text()}`);
 const data = await res.json();
 return data.data[0].embedding;
}

async function matchResources(embedding, category, env) {
 const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/match_resources`, {
  method: 'POST',
  headers: {
   apikey: env.SUPABASE_ANON_KEY,
   Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   query_embedding: embedding,
   match_category: category,
   match_count: 8,
  }),
 });
 if (!res.ok) throw new Error(`Resource match failed: ${await res.text()}`);
 return res.json();
}

async function generateMonthSkeleton(goal, totalMonths, resources, apiKey) {
 console.log('Resources found:', resources.length, JSON.stringify(resources.map((r) => r.title)));

 const resourceList = resources.map((r) => `- ${r.title} (${r.type})`).join('\n');

 const prompt = `You are building a high-level learning roadmap skeleton for a goal-tracking app.

Goal: ${goal.title}
Category: ${goal.category}
Description: ${goal.description || 'N/A'}
Experience level: ${goal.experienceLevel || goal.experience_level || 'N/A'}
Total timeline: ${totalMonths} months
Weekly study hours: ${goal.studyHours || goal.study_hours || 'N/A'}
Motivation: ${goal.motivation || 'N/A'}

Real resources available for this category (use these as grounding for what topics make sense — do not invent resources that aren't listed here):
${resourceList}

Generate ONLY a month-by-month skeleton: one short, specific title per month describing what that month focuses on (e.g. "HTML & CSS Foundations", not "Learn programming"). Titles should build progressively toward the goal. Do NOT generate weeks or days.
Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"months":[{"index":1,"title":"string"}]}

Generate exactly ${totalMonths} month entries.`;

 const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
   Authorization: `Bearer ${apiKey}`,
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   model: 'openai/gpt-4o-mini',
   messages: [{ role: 'user', content: prompt }],
   response_format: { type: 'json_object' },
  }),
 });

 const rawText = await res.text();
 console.log('Model raw response:', rawText);

 if (!res.ok) throw new Error(`Roadmap generation failed: ${rawText}`);
 const data = JSON.parse(rawText);
 const parsed = JSON.parse(data.choices[0].message.content);
 return parsed.months;
}

async function handleMonthRequest(request, env) {
 const { goal, month } = await request.json();

 const embeddingInput = `${goal.title}. ${month.title}. ${goal.category}`;
 const embedding = await getEmbedding(embeddingInput, env.OPENROUTER_API_KEY);
 const resources = await matchResources(embedding, goal.category, env);
 const resourceList = resources.map((r) => `- ${r.title} (${r.type})`).join('\n');

 const prompt = `You are building the detailed plan for ONE month of a learning roadmap.

Overall goal: ${goal.title}
This month's focus: ${month.title} (Month ${month.index})
Experience level: ${goal.experienceLevel || goal.experience_level || 'N/A'}
Weekly study hours: ${goal.studyHours || goal.study_hours || 'N/A'}

Real resources available (ground your plan in these — do not invent resources not listed here):
${resourceList}

Generate:
1. "skills": 3-5 specific skills learned this month
2. "projects": 1-2 small project ideas that apply this month's skills
3. "days": exactly 30 entries, one per day, each with a short specific title describing that day's focus — build progressively across the month, and make roughly every 7th day a lighter review/practice day

Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"skills":["string"],"projects":["string"],"days":[{"index":1,"title":"string"}]}`;

 const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
   Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   model: 'openai/gpt-4o-mini',
   messages: [{ role: 'user', content: prompt }],
   response_format: { type: 'json_object' },
  }),
 });

 const rawText = await res.text();
 console.log('Month detail raw response:', rawText);
 if (!res.ok) throw new Error(`Month detail generation failed: ${rawText}`);

 const data = JSON.parse(rawText);
 const parsed = JSON.parse(data.choices[0].message.content);

 const detail = {
  skills: parsed.skills,
  projects: parsed.projects,
  days: parsed.days.map((d) => ({
   index: d.index,
   title: d.title,
   completed: false,
   detail: null,
  })),
 };

 return new Response(JSON.stringify({ detail }), {
  headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
 });
}

async function handleDayRequest(request, env) {
 const { goal, month, day } = await request.json();

 const skillsList = (month.detail?.skills || []).join(', ');
 const projectsList = (month.detail?.projects || []).join(', ');

 const embeddingInput = `${goal.title}. ${month.title}. Day ${day.index}${day.title ? `: ${day.title}` : ''}`;
 const embedding = await getEmbedding(embeddingInput, env.OPENROUTER_API_KEY);
 const resources = await matchResources(embedding, goal.category, env);
 const resourceList = resources.map((r, i) => `${i + 1}. ${r.title} (${r.type}${r.is_free ? ', free' : ''})`).join('\n');

 const prompt = `You are creating a detailed, guided study plan for ONE day of a learning roadmap. The learner needs to know exactly WHAT to do and WHERE to learn it — not just a checklist.
 Overall goal: ${goal.title}
This month's focus: ${month.title}
This month's skills: ${skillsList || 'N/A'}
This month's projects: ${projectsList || 'N/A'}
Today's focus: Day ${day.index}${day.title ? ` — ${day.title}` : ''}

Real resources available for today (use ONLY these — do not invent courses, videos, or links that aren't listed):
${resourceList || 'No specific resources matched — give general guidance instead.'}

Generate:
1. "title": a short, specific title for today's mission
2. "overview": 2-3 sentences explaining what today covers and why it matters for the overall goal
3. "tasks": 2-4 specific tasks for TODAY ONLY. For each task give:
   - "task": the short action item
   - "how": 1-2 sentences explaining exactly how to do it, referencing which resource above to use (by its title) if relevant
4. "resourceIndexes": an array of numbers — the indexes (from the numbered list above) of the resources that are actually relevant to today, in the order the learner should use them. Empty array if none matched well.
5. "aiTip": one short, encouraging, specific tip (1 sentence) for today

Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"title":"string","overview":"string","tasks":[{"task":"string","how":"string"}],"resourceIndexes":[number],"aiTip":"string"}`;

 const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
   Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   model: 'openai/gpt-4o-mini',
   messages: [{ role: 'user', content: prompt }],
   response_format: { type: 'json_object' },
  }),
 });

 const rawText = await res.text();
 console.log('Day detail raw response:', rawText);
 if (!res.ok) throw new Error(`Day detail generation failed: ${rawText}`);

 const data = JSON.parse(rawText);
 const parsed = JSON.parse(data.choices[0].message.content);

 const selectedResources = (parsed.resourceIndexes || [])
  .map((n) => resources[n - 1])
  .filter(Boolean)
  .map((r) => ({ title: r.title, type: r.type, url: r.url, is_free: r.is_free }));

 const detail = {
  title: parsed.title,
  overview: parsed.overview,
  tasks: parsed.tasks.map((t, i) => ({
   id: `${day.index}-${i}`,
   task: t.task,
   how: t.how,
   done: false,
  })),
  resources: selectedResources,
  aiTip: parsed.aiTip,
  notes: '',
 };

 return new Response(JSON.stringify({ detail }), {
  headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
 });
}

async function handleChatRequest(request, env) {
  const { messages, goalsContext } = await request.json();

  const systemPrompt = `You are Launchpad's AI Coach — a supportive, knowledgeable guide helping someone work toward their personal and career goals.

Here is what you know about this person's current goals:
${goalsContext || "They haven't shared any goals with you yet."}

Be encouraging but honest. Give specific, actionable advice tied to their actual goals and progress when relevant. Keep responses conversational and concise (a few sentences, not an essay) unless they ask for something detailed.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:` Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  const rawText = await res.text();
  if (!res.ok) throw new Error(`Chat failed: ${rawText}`);
  const data = JSON.parse(rawText);
  const reply = data.choices[0].message.content;

  return new Response(JSON.stringify({ reply }), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

async function handleProgressRequest(request, env) {
  const { goalsSummary } = await request.json();

  const prompt = `You are Launchpad's AI coach writing a progress review for someone working toward their goals.

Here is their current progress data (real numbers, not estimates):
${JSON.stringify(goalsSummary, null, 2)}

Write a short, honest progress review:
1. "summary": 2-3 sentences evaluating their overall progress. Reference actual goal titles, percentages, or streak numbers from the data above. Be encouraging but specific and honest — do not just praise, point out anything that's stalling or behind if the data shows it.
2. "nextSteps": an array of exactly 2-3 short, specific, actionable next steps for the upcoming week, grounded in the data above (e.g. which goal to focus on, what's currently blocking progress).

Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"summary":"string","nextSteps":["string"]}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  const rawText = await res.text();
  if (!res.ok) throw new Error(`Progress feedback failed: ${rawText}`);
  const data = JSON.parse(rawText);
  const feedback = JSON.parse(data.choices[0].message.content);

  return new Response(JSON.stringify({ feedback }), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}