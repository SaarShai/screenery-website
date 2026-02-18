import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email } = body;

    // Basic validation
    if (!name || !company || !email) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Send notification email to Alicia
    // Once screenery.design is verified in Resend, change from address to:
    // "Screenery <hello@screenery.design>"
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Screenery Website <onboarding@resend.dev>";

    await resend.emails.send({
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
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b;">Hotel / Company</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e2dc;">
                <a href="mailto:${email}" style="color: #8b7355;">${email}</a>
              </td>
            </tr>
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #999;">
            Sent from the Screenery website contact form.
            You can reply directly to this email to reach ${name}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
