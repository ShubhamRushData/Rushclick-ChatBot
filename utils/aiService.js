import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export async function askGPT(question) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a support chatbot. Always reply in 2-3 short sentences, simple and clear. No long paragraphs. Be friendly and concise."
          },
          { role: "user", content: question }
        ],
        max_tokens: 150 // limit length
      }),
    });

    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content || null;

    // Truncate if somehow AI writes too long
    if (reply && reply.split(" ").length > 40) {
      reply = reply.split(" ").slice(0, 40).join(" ") + "...";
    }

    return reply;
  } catch (error) {
    console.error("AI Service Error:", error);
    return null;
  }
}
