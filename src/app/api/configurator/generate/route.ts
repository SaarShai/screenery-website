import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Config, Kit } from "@/lib/configurator/config";
import { interpret, photo } from "@/lib/configurator/openai";
import { newId, save, saveFile } from "@/lib/configurator/store";

export const maxDuration = 300; // image edits take 30–60 s

const FREE_PREVIEWS = 1;
const MAX_CAPTURE = 8 * 1024 * 1024;

async function loadKit(id: string): Promise<Kit | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), "public", "kits", id, "kit.json"), "utf8"));
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (process.env.GENERATION_ENABLED !== "true") {
    return Response.json({ ok: false, message: "Photo previews are not enabled yet." }, { status: 503 });
  }

  const jar = await cookies();
  const used = Number(jar.get("sc_gen")?.value ?? 0);
  if (used >= FREE_PREVIEWS && !jar.get("sc_user")?.value) {
    return Response.json({ ok: false, gate: true, message: "Sign up to make more previews." }, { status: 402 });
  }

  const body = await request.json().catch(() => null);
  const config = body?.config as Config | undefined;
  const capture = typeof body?.capture === "string" ? body.capture : "";
  if (!config?.kitId || !capture.startsWith("data:image/png;base64,") || capture.length > MAX_CAPTURE) {
    return Response.json({ ok: false, message: "A configuration and a capture are required." }, { status: 400 });
  }
  const kit = await loadKit(config.kitId);
  if (!kit) return Response.json({ ok: false, message: "Unknown design." }, { status: 400 });

  try {
    const brief = await interpret(kit, config);
    const result = await photo(Buffer.from(capture.slice(capture.indexOf(",") + 1), "base64"), brief, config.logo?.dataUrl);
    const id = newId();
    await saveFile("renders", `${id}.webp`, new Uint8Array(result.image), "image/webp");
    await save("renders", id, {
      id,
      createdAt: new Date().toISOString(),
      config: { ...config, logo: config.logo ? { name: config.logo.name } : undefined },
      brief,
      model: result.model,
      usage: result.usage,
    });
    jar.set("sc_gen", String(used + 1), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return Response.json({ ok: true, id, url: `/api/render/${id}`, summary: brief.summary, unsupported: brief.unsupported });
  } catch (err) {
    console.error("[generate]", err);
    return Response.json({ ok: false, message: "The preview could not be made. Please try again." }, { status: 502 });
  }
}
