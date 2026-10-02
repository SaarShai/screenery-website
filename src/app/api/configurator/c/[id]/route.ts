import { load } from "@/lib/configurator/store";

export async function GET(_request: Request, ctx: RouteContext<"/api/configurator/c/[id]">) {
  const { id } = await ctx.params;
  const config = await load("configs", id);
  if (!config) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(config);
}
