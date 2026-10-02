import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Config, Kit } from "@/lib/configurator/config";
import { interpret } from "@/lib/configurator/openai";

/** Echo-only call: the brief without an image, for checking a request before spending on a photo. */
export async function POST(request: Request) {
  if (process.env.GENERATION_ENABLED !== "true") {
    return Response.json({ ok: false, message: "Photo previews are not enabled yet." }, { status: 503 });
  }
  const config = (await request.json().catch(() => null)) as Config | null;
  if (!config?.kitId || !/^[a-z0-9-]+$/.test(config.kitId)) {
    return Response.json({ ok: false, message: "A configuration is required." }, { status: 400 });
  }
  try {
    const kit: Kit = JSON.parse(await readFile(path.join(process.cwd(), "public", "kits", config.kitId, "kit.json"), "utf8"));
    return Response.json({ ok: true, brief: await interpret(kit, config) });
  } catch (err) {
    console.error("[interpret]", err);
    return Response.json({ ok: false, message: "Could not read the request." }, { status: 502 });
  }
}
