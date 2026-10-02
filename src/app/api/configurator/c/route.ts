import { newId, save } from "@/lib/configurator/store";

export async function POST(request: Request) {
  const config = await request.json();
  if (!config || typeof config !== "object" || typeof config.kitId !== "string") {
    return Response.json({ error: "A configuration with a kitId is required." }, { status: 400 });
  }
  const id = newId();
  await save("configs", id, config);
  return Response.json({ id, url: `/?c=${id}` });
}
