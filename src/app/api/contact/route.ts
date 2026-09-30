import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Honeypot: real visitors never see or fill this field.
    if (clean(body.website, 200)) return NextResponse.json({ success: true });

    const name = clean(body.name, 200);
    const company = clean(body.company, 200);
    const email = clean(body.email, 320);

    if (!name || !company || !email) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // RESEND_FROM_EMAIL should be set in Vercel env vars to: Screenery <hello@screenery.design>
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Screenery <hello@screenery.design>";
    const [n, c, e] = [esc(name), esc(company), esc(email)];

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: "alicia@wanderland.london",
      replyTo: email,
      subject: `New enquiry from ${name} — ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; color: #1a1a1a;">
          <h2 style="font-weight: 300; font-size: 22px; color: #8b7355; margin-bottom: 24px;">
            New Screenery Enquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b; width: 120px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc;">${n}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b;">Hotel / Company</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc;">${c}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc;">
                <a href="mailto:${e}" style="color: #8b7355;">${e}</a>
              </td>
            </tr>
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #999;">
            Sent from the Screenery website contact form.
            You can reply directly to this email to reach ${n}.
          </p>
        </div>
      `,
    });

    if (error || !data?.id) {
      console.error("Contact form: email rejected", error);
      return NextResponse.json(
        { error: "We could not send your enquiry. Please email alicia@wanderland.london." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
