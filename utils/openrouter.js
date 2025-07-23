import dotenv from "dotenv";
dotenv.config();

export async function askGPT(question) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // can change to "anthropic/claude-3-haiku"
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No answer found.";
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return "AI service not responding.";
  }
}
