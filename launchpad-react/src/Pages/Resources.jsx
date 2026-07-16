import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const TYPE_ICONS = {
  Course: "🎓",
  Book: "📘",
  YouTube: "▶️",
  Documentation: "📄",
  "Project Idea": "🛠️",
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, type, category, level, is_free, price_note, url, description")
      .order("category", { ascending: true });

    if (error) {
      console.error("Failed to load resources:", error.message);
    } else {
      setResources(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  const categories = ["all", ...new Set(resources.map((r) => r.category))];

  const filtered = resources.filter((r) => {
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (priceFilter === "free" && !r.is_free) return false;
    if (priceFilter === "paid" && r.is_free) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3 border border-white/20 text-[#F5B342]">
            📚 RESOURCES
          </span>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Learning Resources
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoryFilter(c)}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
                style={
                  categoryFilter === c
                    ? { background: "#F5B342", color: "#1A1305" }
                    : { border: "1px solid rgba(255,255,255,0.15)", color: "#9AA5BD" }
                }
              >
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            {[
              { key: "all", label: "All" },
              { key: "free", label: "Free" },
              { key: "paid", label: "Paid" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPriceFilter(opt.key)}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
                style={
                  priceFilter === opt.key
                    ? { background: "#5EEAD4", color: "#0E1526" }
                    : { border: "1px solid rgba(255,255,255,0.15)", color: "#9AA5BD" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[#9AA5BD]">No resources match these filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
              <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-lg">{TYPE_ICONS[r.type] || "🔗"}</span>
                  <span
                    className="font-mono text-[10px] rounded-full px-2 py-1 flex-shrink-0"
                    style={
                      r.is_free
                        ? { border: "1px solid #5EEAD4", color: "#5EEAD4" }
                        : { border: "1px solid rgba(255,255,255,0.2)", color: "#9AA5BD" }
                    }
                  >
                    {r.is_free ? "FREE" : "PAID"}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {r.title}
                </h3>
                <span className="font-mono text-[10.5px] text-[#9AA5BD] block mb-2">
                  {r.type} · {r.category}
                  {r.level ? ` · ${r.level} `: ""}
                </span>
                <p className="text-sm text-[#9AA5BD] mb-3">{r.description}</p>
                {r.price_note && (
                  <p className="text-xs text-[#9AA5BD] mb-3 italic">{r.price_note}</p>
                )}
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold"
                    style={{ color: "#F5B342" }}
                  >
                    Visit →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}