import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { askGPT } from "../utils/aiService.js";

const router = express.Router();

// Handle relative path for faq.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const faqPath = path.join(__dirname, "../data/faq.json");
const faqData = JSON.parse(fs.readFileSync(faqPath, "utf8"));

// Normalize text (case-insensitive & remove special chars)
function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/gi, "").trim();
}

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Message is required" });

  const userMsg = normalize(message);

  // 1. Check Predefined FAQ
  const found = faqData.find(
    (item) =>
      normalize(userMsg).includes(normalize(item.question)) ||
      normalize(item.question).includes(userMsg)
  );

  if (found) {
    return res.json({ reply: found.answer, from: "faq" });
  }

  // 2. Get AI Answer if not in FAQ
  try {
    const aiReply = await askGPT(message);
    if (!aiReply) {
      return res.status(503).json({ reply: "AI service not responding." });
    }

    res.json({ reply: aiReply, from: "ai" });
  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

export default router;
