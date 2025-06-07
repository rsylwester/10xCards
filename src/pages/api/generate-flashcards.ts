import type { APIRoute } from "astro";

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface FlashcardCandidate {
  front: string;
  back: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = import.meta.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey === "your_openrouter_api_key_here") {
      return new Response(
        JSON.stringify({
          error:
            "OpenRouter API key not configured. Please add your API key to the .env file. Get one at https://openrouter.ai",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Limit text to first 1500 words
    const words = text.trim().split(/\s+/);
    const limitedText = words.slice(0, 1500).join(" ");

    const prompt = `Analyze the following English text and extract up to 10 useful words or phrases suitable for B2/C1 level English learners. Return them as a JSON array of objects with "front" (English word/phrase) and "back" (Polish translation) properties.

Focus on:
- Advanced vocabulary (B2/C1 level)
- Useful phrases and collocations
- Words that appear in academic or professional contexts
- Avoid basic vocabulary

Text to analyze:
${limitedText}

Respond with only a valid JSON array, no additional text.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "FlashcardAI",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenRouter API");
    }

    // Parse the JSON response - handle markdown code blocks
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const flashcards = JSON.parse(cleanContent) as FlashcardCandidate[];

      // Validate the response structure
      if (!Array.isArray(flashcards)) {
        throw new Error("Response is not an array");
      }

      const validFlashcards = flashcards
        .filter(
          (card) =>
            card &&
            typeof card.front === "string" &&
            typeof card.back === "string" &&
            card.front.trim() !== "" &&
            card.back.trim() !== ""
        )
        .slice(0, 10);

      return new Response(JSON.stringify({ flashcards: validFlashcards }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // eslint-disable-next-line no-console
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({
          error: "Failed to parse AI response as JSON",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating flashcards:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate flashcards",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
