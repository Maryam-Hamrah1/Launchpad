
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { resourcesData } from "./src/data/resourcesData.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENROUTER_API_KEY) {
  console.error("Missing one of SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getEmbedding(text) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Embedding request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

// Combine the fields that matter for semantic matching into one string.
function buildInputText(resource) {
  return [
    resource.title,
    `${resource.type} for ${resource.category}`,
    resource.level ? `${resource.level} level `: null,
    resource.description,
  ]
    .filter(Boolean)
    .join(". ");
}

async function run() {
  console.log(`Embedding ${resourcesData.length} resources...\n`);

  for (const resource of resourcesData) {
    try {
      const embedding = await getEmbedding(buildInputText(resource));

      const { error } = await supabase.from("resources").insert({
        title: resource.title,
        type: resource.type,
        category: resource.category,
        level: resource.level,
        is_free: resource.is_free,
        price_note: resource.price_note,
        url: resource.url,
        description: resource.description,
        embedding,
      });

      if (error) {
        console.error(`✗ ${resource.title}: ${error.message}`);
      } else {
        console.log(`✓ ${resource.title}`);
      }
    } catch (err) {
      console.error(`✗ ${resource.title}: ${err.message}`);
    }
  }

  console.log("\nDone.");
}

run();