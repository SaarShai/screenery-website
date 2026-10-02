import { isId, loadFile } from "@/lib/configurator/store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = isId(id) ? await loadFile("renders", `${id}.webp`) : null;
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(file), {
    headers: { "content-type": "image/webp", "cache-control": "private, max-age=31536000, immutable" },
  });
}
