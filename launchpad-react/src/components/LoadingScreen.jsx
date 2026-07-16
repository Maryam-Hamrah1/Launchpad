
function LoadingScreen({ mode = "goal" }) {
    const message =
    mode === "draft" ? "Saving your draft..." : "Generating your personalized roadmap...";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1526] text-[#EDEFF6] px-6">
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-[#F5B342] animate-bounce"
            style={{ animationDelay:` ${i * 0.15}s `}}
          />
        ))}
      </div>
      <p className="font-mono text-sm text-[#9AA5BD]">{message}</p>
    </div>
  )
}

export default LoadingScreen




