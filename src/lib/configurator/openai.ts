// Thin fetch wrappers over the two OpenAI calls the configurator makes. No SDK: two endpoints.
import type { Config, Kit } from "./config";

const BASE = "https://api.openai.com/v1";
const TEXT_MODEL = process.env.TEXT_MODEL ?? "gpt-5.4-nano";
const IMAGE_MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2.5-sunburst";
const IMAGE_QUALITY = process.env.IMAGE_QUALITY ?? "medium";

export type Brief = {
  summary: string;
  artwork: string;
  logo_placement: string;
  unsupported: string[];
};

const BRIEF_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "artwork", "logo_placement", "unsupported"],
  properties: {
    summary: { type: "string", description: "One short sentence echoing what will change, for the client to check." },
    artwork: {
      type: "string",
      description:
        "Concrete instructions to an image editor for the artwork only: colours, motifs, style, mood. Empty string when nothing changes.",
    },
    logo_placement: { type: "string", description: "Where the client logo goes, in plain words. Empty when there is no logo." },
    unsupported: {
      type: "array",
      items: { type: "string" },
      description: "Requests the configurator cannot do (panel count, sizes, licensed characters, new parts).",
    },
  },
} as const;

function auth() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return { authorization: `Bearer ${key}` };
}

/** Turns preset, swatches and free text into an image-editing brief plus a one-line echo. */
export async function interpret(kit: Kit, config: Config): Promise<Brief> {
  const facts = [
    `Design: ${kit.name}.`,
    `Felt palette as designed: front ${kit.palette.front}, middle ${kit.palette.middle}, back ${kit.palette.back}.`,
    config.theme.preset ? `Chosen mood: ${config.theme.preset}.` : "",
    config.palette.length ? `Chosen colours: ${config.palette.join(", ")}.` : "",
    config.logo ? "The client supplied a logo image." : "No logo supplied.",
    `Request: ${config.theme.text?.trim() || "(none)"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(`${BASE}/responses`, {
    method: "POST",
    headers: { ...auth(), "content-type": "application/json" },
    body: JSON.stringify({
      model: TEXT_MODEL,
      reasoning: { effort: "none" },
      input: [
        {
          role: "system",
          content:
            "You interpret a hotel client's wishes for a Screenery felt play-screen set. The set's shape, panels and cut-outs are fixed; only the printed artwork, colours and a logo can change. Write the artwork brief as direct instructions to a photo editor, one paragraph, no headings. Never invent wording to print. Put anything that changes shape, size, panel count or uses licensed characters into unsupported.",
        },
        { role: "user", content: facts },
      ],
      text: { format: { type: "json_schema", name: "brief", strict: true, schema: BRIEF_SCHEMA } },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`interpret: ${data.error?.message ?? res.status}`);
  const text = data.output?.flatMap((o: { type: string; content?: { text: string }[] }) => (o.type === "message" ? o.content ?? [] : [])).map((c: { text: string }) => c.text)[0];
  return JSON.parse(text) as Brief;
}

export type Generated = { image: Buffer; model: string; usage: unknown };

/** Edits the viewer capture into a product photo. `logo` is a data URL when present. */
export async function photo(capture: Buffer, brief: Brief, logo?: string): Promise<Generated> {
  const prompt = [
    "Photorealistic product photograph of this exact felt play screen. Keep the geometry, layout, camera, panel outlines and cut-outs identical.",
    "Wool felt texture with visible fibres and stitched edges, soft studio light, plain pale studio floor and background.",
    brief.artwork,
    logo
      ? `The second image is the client's logo. Place it once, flat on the felt, ${brief.logo_placement || "on the most prominent central panel"}; keep it legible, undistorted and in its own colours.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const form = new FormData();
  form.append("model", IMAGE_MODEL);
  form.append("quality", IMAGE_QUALITY);
  form.append("size", "1536x1024");
  form.append("output_format", "webp");
  form.append("prompt", prompt);
  form.append("image[]", new Blob([new Uint8Array(capture)], { type: "image/png" }), "capture.png");
  if (logo) {
    const [head, b64] = logo.split(",");
    const type = head.match(/^data:([^;]+)/)?.[1] ?? "image/png";
    form.append("image[]", new Blob([new Uint8Array(Buffer.from(b64, "base64"))], { type }), type.includes("svg") ? "logo.svg" : "logo.png");
  }

  const res = await fetch(`${BASE}/images/edits`, { method: "POST", headers: auth(), body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(`images/edits: ${data.error?.message ?? res.status}`);
  return { image: Buffer.from(data.data[0].b64_json, "base64"), model: IMAGE_MODEL, usage: data.usage };
}
