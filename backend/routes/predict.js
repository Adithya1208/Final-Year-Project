// backend/routes/ai.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/predict", async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  // Build your chat prompt similar to the previous example
  const prompt = `  
  Answer "true" if suspicious and "false" if not. If amount is bigger than 50000, consider it suspicious, answer "true"`;

  console.log(prompt);

  try {
    const chatResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // or your preferred model
        messages: [
          {
            role: "system",
            content: `You are an assistant that evaluates transactions for anti money laundering purposes. Respond only with 'true' or 'false'. ${prompt}`,
          },
          {
            role: "user",
            content: `Transaction amount: ${amount}. Is this transaction suspicious?`,
          },
        ],
        max_completion_tokens: 5,
        temperature: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const result = chatResponse.data.choices[0].message.content.trim().toLowerCase();
    res.json({ suspicious: result === "true" });
  } catch (error) {
    console.error("AI prediction error:", error);
    res.status(500).json({ message: "Prediction error" });
  }
});

module.exports = router;
