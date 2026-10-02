import { sendMail } from "@/lib/configurator/mail";
import { newId, save } from "@/lib/configurator/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email)) {
    return Response.json({ error: "That email address is not valid." }, { status: 400 });
  }

  const id = newId();
  const token = newId();
  await save("signups", id, { id, email, token, createdAt: new Date().toISOString() });
  await sendMail({
    to: email,
    subject: "Confirm your Screenery previews",
    text: `Confirm this address: /api/signup/verify?token=${token} (not wired yet)`,
  });
  return Response.json({ ok: true });
}
