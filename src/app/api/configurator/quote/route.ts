import { sendMail } from "@/lib/configurator/mail";
import { newId, save } from "@/lib/configurator/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const contact = body?.contact ?? {};
  const config = body?.config;

  if (!config || typeof config.kitId !== "string") {
    return Response.json({ error: "A configuration is required." }, { status: 400 });
  }
  for (const field of ["name", "company", "email"] as const) {
    if (typeof contact[field] !== "string" || !contact[field].trim()) {
      return Response.json({ error: `A ${field} is required.` }, { status: 400 });
    }
  }
  if (!EMAIL.test(contact.email)) {
    return Response.json({ error: "That email address is not valid." }, { status: 400 });
  }

  // The quote freezes its configuration, so save one when the client sent no id.
  const configId = typeof body.configId === "string" ? body.configId : newId();
  if (configId !== body.configId) await save("configs", configId, config);

  const id = newId();
  const quote = {
    id,
    createdAt: new Date().toISOString(),
    configId,
    config,
    contact: { name: contact.name, company: contact.company, email: contact.email },
    sets: Number(body.sets) || 1,
    country: typeof body.country === "string" ? body.country : "",
    targetDate: typeof body.targetDate === "string" ? body.targetDate : "",
    notes: typeof body.notes === "string" ? body.notes : "",
  };
  await save("quotes", id, quote);

  await sendMail({
    to: process.env.QUOTE_TO ?? "hello@screenery.design",
    subject: `Quote ${id} · ${config.kitId} · ${contact.company}`,
    text: [
      `${contact.name}, ${contact.company} <${contact.email}>`,
      `Design ${config.kitId}, layout ${config.layout}, extras ${config.extras?.join(", ") || "none"}`,
      `Sets ${quote.sets}, country ${quote.country || "-"}, target ${quote.targetDate || "-"}`,
      quote.notes && `Notes: ${quote.notes}`,
      `Configuration /?c=${configId}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return Response.json({ id });
}
