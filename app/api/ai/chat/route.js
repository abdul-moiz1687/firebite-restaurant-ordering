
import "server-only";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { categories, menuItems } from "@/data/menu";

let aiRateLimiter;

function getAiRateLimiter() {
  if (aiRateLimiter) return aiRateLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash credentials are missing.");
  }

  const redis = new Redis({ url, token });

  aiRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "firebite:ai-chat",
  });

  return aiRateLimiter;
}

const MODEL = "gemini-3.1-flash-lite";

export async function POST(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: "Request must be JSON." },
      { status: 415 }
    );
  }

  const contentLength = Number(
    request.headers.get("content-length") || 0
  );

  if (contentLength > 12000) {
    return Response.json(
      { error: "Message is too large." },
      { status: 413 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Gemini API key is not configured." },
      { status: 500 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body?.messages)) {
    return Response.json(
      { error: "Messages must be an array." },
      { status: 400 }
    );
  }

  if (body.messages.length === 0 || body.messages.length > 10) {
    return Response.json(
      { error: "Maximum 10 messages are allowed." },
      { status: 400 }
    );
  }

  const messages = body.messages;

  let totalCharacters = 0;

  for (const message of messages) {
    if (
      !message ||
      !["user", "model"].includes(message.role) ||
      typeof message.text !== "string" ||
      !message.text.trim() ||
      message.text.length > 1000
    ) {
      return Response.json(
        { error: "Invalid message format." },
        { status: 400 }
      );
    }

    totalCharacters += message.text.length;
  }

  if (
    totalCharacters > 6000 ||
    messages[messages.length - 1].role !== "user"
  ) {
    return Response.json(
      { error: "Conversation limit exceeded." },
      { status: 400 }
    );
  }

  const clientIp =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local-development";

  try {
    const limiter = getAiRateLimiter();
    const { success } = await limiter.limit(clientIp);

    if (!success) {
      return Response.json(
        { error: "Too many messages. Please try again shortly." },
        { status: 429 }
      );
    }
  } catch (error) {
    console.error("AI rate limiter failed:", error);

    return Response.json(
      { error: "Chat is temporarily unavailable." },
      { status: 503 }
    );
  }

  const menuContext = categories.map((category) => ({
    category: category.name,
    items: menuItems
      .filter((item) => item.categoryId === category.id)
      .map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        currency: "PKR",
        badge: item.badge || null,
      })),
  }));

  const systemInstruction = `
You are Firebite's friendly restaurant food assistant.

Your job is to help customers understand the Firebite menu.

RULES:
1. Only recommend products present in the supplied menu.
2. Always use the exact supplied prices in PKR.
3. Never invent products, prices, ingredients or availability.
4. Help customers choose food within their budget.
5. Compare menu items when requested.
6. Understand English and Roman Urdu.
7. Reply in the same language the customer uses.
8. Keep replies friendly, natural and reasonably short.
9. If asked about ingredients or allergens not listed,
   clearly say that the information is not available.
10. You cannot place orders or modify the shopping cart.
11. For unrelated questions, politely bring the conversation
    back to Firebite's food menu.

OFFICIAL FIREBITE MENU:
${JSON.stringify(menuContext)}
`;

  try {
  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const geminiPayload = {
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.text.trim() }],
    })),
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 350,
    },
  };

  let response;
  let result = {};

  for (let attempt = 0; attempt < 2; attempt++) {
    response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
      body: JSON.stringify(geminiPayload),
        signal: AbortSignal.timeout(20000),
        cache: "no-store",
    });

    result = await response.json().catch(() => ({}));

    if (response.status !== 503 || attempt === 1) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  if (!response.ok) {
    console.error("Gemini API error:", {
      status: response.status,
      message: result?.error?.message,
      code: result?.error?.status,
    });

      return Response.json(
      process.env.NODE_ENV !== "production"
        ? {
            error: "Gemini API request failed.",
            googleStatus: response.status,
            googleMessage:
              result?.error?.message || "No error message returned.",
            googleCode: result?.error?.status || "UNKNOWN",
          }
        : { error: "Unable to get an AI response right now." },
        { status: 502 }
      );
    }

    const reply = result?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return Response.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Gemini request failed:", error);

    return Response.json(
      { error: "Unable to connect to the AI service." },
      { status: 502 }
    );
  }
}
