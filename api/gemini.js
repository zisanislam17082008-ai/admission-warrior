
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const KEY = process.env.GEMINI_API_KEY;

  if (!KEY) {
    return res.status(503).json({
      error: "Gemini API key is missing"
    });
  }

  try {
    const { parts, system, json } = req.body || {};

    if (!Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({
        error: "Valid parts are required"
      });
    }

    const models = (
      process.env.GEMINI_MODELS ||
      "gemini-2.5-flash,gemini-2.0-flash"
    ).split(",").map(m => m.trim()).filter(Boolean);

    let lastError = "Gemini failed";

    for (const model of models) {
      try {
        const body = {
          contents: [{
            role: "user",
            parts
          }]
        };

        if (system) {
          body.systemInstruction = {
            parts: [{ text: system }]
          };
        }

        if (json) {
          body.generationConfig = {
            responseMimeType: "application/json"
          };
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message || `HTTP ${response.status}`
          );
        }

        const text = data?.candidates?.[0]?.content?.parts
          ?.map(p => p.text || "")
          .join("\n")
          .trim();

        if (text) {
          return res.status(200).json({ text });
        }

        throw new Error("Empty Gemini response");

      } catch (error) {
        lastError = error.message;
      }
    }

    return res.status(502).json({ error: lastError });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
