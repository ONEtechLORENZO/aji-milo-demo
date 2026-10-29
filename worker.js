// Server di MILO per la demo AJI su WhatsApp (Cloudflare Worker).
// Tiene la chiave API di Anthropic lontana dal browser e accetta richieste solo dal sito della demo.

const MAX_MESSAGES = 60;
const MAX_CHARS_PER_MESSAGE = 12000;
const MAX_SYSTEM_CHARS = 80000;

function cors(origin, allowed) {
  return {
    "Access-Control-Allow-Origin": origin === allowed ? allowed : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN;
    const headers = cors(origin, allowed);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, headers);
    if (origin !== allowed) return json({ error: "forbidden_origin" }, 403, headers);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad_request" }, 400, headers); }

    const { system, messages } = body || {};
    const valid =
      typeof system === "string" && system.length <= MAX_SYSTEM_CHARS &&
      Array.isArray(messages) && messages.length > 0 && messages.length <= MAX_MESSAGES &&
      messages.every(m => (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" && m.content.length <= MAX_CHARS_PER_MESSAGE) &&
      messages[0].role === "user";
    if (!valid) return json({ error: "bad_request" }, 400, headers);

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.MODEL || "claude-haiku-5-5",
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    if (upstream.status === 429) return json({ error: "rate_limited" }, 429, headers);
    if (!upstream.ok) return json({ error: "upstream_error", status: upstream.status }, 502, headers);

    const data = await upstream.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    try {
      return json(JSON.parse(clean.slice(start, end + 1)), 200, headers);
    } catch {
      return json({ error: "invalid_json" }, 502, headers);
    }
  },
};
