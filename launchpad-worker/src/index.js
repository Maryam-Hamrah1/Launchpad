// src/index.js
// Generates the 12-month roadmap SKELETON only (titles + lock status).
// Week/day details are generated later, on demand, per month.

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
			if (url.pathname === '/week') {
				return await handleWeekRequest(request, env);
			}
			if (url.pathname === '/month') {
				return await handleMonthRequest(request, env);
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
			Authorization: ` Bearer ${env.SUPABASE_ANON_KEY}`,
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
3. "weeks": exactly 4 week entries, each with a short specific title describing that week's focus, building progressively within the month

Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"skills":["string"],"projects":["string"],"weeks":[{"index":1,"title":"string"}]}`;

	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: ` Bearer ${env.OPENROUTER_API_KEY}`,
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
		weeks: parsed.weeks.map((w, i) => ({
			index: w.index,
			title: w.title,
			status: i === 0 ? 'current' : 'locked',
			detail: null,
		})),
	};

	return new Response(JSON.stringify({ detail }), {
		headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
	});
}

async function handleWeekRequest(request, env) {
	const { goal, month, week } = await request.json();

	const embeddingInput = ` ${goal.title}. ${month.title}. ${week.title}`;
	const embedding = await getEmbedding(embeddingInput, env.OPENROUTER_API_KEY);
	const resources = await matchResources(embedding, goal.category, env);
	const resourceList = resources.map((r) => `- ${r.title} (${r.type})`).join('\n');

	const prompt = ` You are building the detailed plan for ONE week of a learning roadmap.

Overall goal: ${goal.title}
Month focus: ${month.title}
This week's focus: ${week.title} (Week ${week.index} of Month ${month.index})
Weekly study hours: ${goal.studyHours || goal.study_hours || 'N/A'}

Real resources available (ground your advice in these):
${resourceList}

Generate:
1. "checklist": 4-6 specific, actionable tasks for this week
2. "estimatedHours": a realistic number of hours this week's checklist takes
3. "aiAdvice": one short, encouraging, specific tip (1-2 sentences) for this exact week
4. "days": exactly 7 entries, one per day (Monday through Sunday), each with a short title describing that day's focus — lighter load on weekends is fine

Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"checklist":["string"],"estimatedHours":number,"aiAdvice":"string","days":[{"index":1,"name":"Monday","title":"string"}]}`;

	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: ` Bearer ${env.OPENROUTER_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: 'openai/gpt-4o-mini',
			messages: [{ role: 'user', content: prompt }],
			response_format: { type: 'json_object' },
		}),
	});

	const rawText = await res.text();
	console.log('Week detail raw response:', rawText);
	if (!res.ok) throw new Error(`Week detail generation failed: ${rawText}`);

	const data = JSON.parse(rawText);
	const parsed = JSON.parse(data.choices[0].message.content);

	const detail = {
		checklist: parsed.checklist.map((task, i) => ({ id: `${week.index}-${i}`, task, done: false })),
		estimatedHours: parsed.estimatedHours,
		aiAdvice: parsed.aiAdvice,
		resources: resources.map((r) => ({ title: r.title, type: r.type, url: r.url, is_free: r.is_free })),
		days: parsed.days.map((d, i) => ({
			index: d.index,
			name: d.name,
			title: d.title,
			status: i === 0 ? 'current' : 'locked',
			detail: null,
		})),
	};

	return new Response(JSON.stringify({ detail }), {
		headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
	});
}

async function handleDayRequest(request, env) {
	const { goal, week, day } = await request.json();

	const weekTaskList = week.detail.checklist.map((t) => ` - ${t.task}`).join('\n');

	const prompt = `You are breaking down ONE day of a weekly learning plan into specific tasks.

Overall goal: ${goal.title}
This week's focus: ${week.title}
This week's full checklist (for context, don't repeat all of it):
${weekTaskList}

Today's focus: ${day.name} — ${day.title}

Generate:
1. "tasks": 2-4 specific, small tasks for TODAY ONLY that move this week's checklist forward
2. "aiTip": one short, encouraging, specific tip (1 sentence) for today

Return ONLY valid JSON, no markdown, no explanation, matching exactly:
{"tasks":["string"],"aiTip":"string"}`;

	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: ` Bearer ${env.OPENROUTER_API_KEY}`,
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

	const detail = {
		tasks: parsed.tasks.map((task, i) => ({ id: `${day.index}-${i}`, task, done: false })),
		aiTip: parsed.aiTip,
		notes: '',
	};

	return new Response(JSON.stringify({ detail }), {
		headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
	});
}

async function handleChatRequest(request, env) {
  const { messages, goalsContext } = await request.json();

  const systemPrompt =` You are Launchpad's AI Coach — a supportive, knowledgeable guide helping someone work toward their personal and career goals.

Here is what you know about this person's current goals:
${goalsContext || "They haven't shared any goals with you yet."}

Be encouraging but honest. Give specific, actionable advice tied to their actual goals and progress when relevant. Keep responses conversational and concise (a few sentences, not an essay) unless they ask for something detailed.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
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
