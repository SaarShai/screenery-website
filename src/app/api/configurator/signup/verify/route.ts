import { list } from "@/lib/configurator/store";

type Signup = { id: string; email: string; token: string };

/** Link from the sign-up mail: marks this browser as verified and returns to the configurator. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const signup = (await list<Signup>("signups")).find((s) => s.token === token);
  if (!signup) return new Response("This link is not valid.", { status: 400 });
  return new Response(null, {
    status: 303,
    headers: {
      location: "/?verified=1",
      "set-cookie": `sc_user=${signup.id}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`,
    },
  });
}
