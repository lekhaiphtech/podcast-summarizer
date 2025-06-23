export const summarizeWithGemini = async (
  description: string
): Promise<string> => {
  const prompt = `Summarize: \n\n${description}`;

  const model = "models/gemini-2.0-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are a summarization assistant." }],
        },
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
      }),
    }
  );

  const json = await response.json();
  const summary = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!summary) {
    console.error("Gemini response missing expected content:", json);

    throw new Error("Failed to generate summary");
  }

  return summary;
};
