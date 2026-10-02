export type Mail = { to: string; subject: string; text: string };

/**
 * Console transport only. A real provider (Resend/SES) is wired in a later
 * phase; RESEND_API_KEY only changes the warning, not the delivery.
 */
export async function sendMail(mail: Mail): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    console.warn("[mail] RESEND_API_KEY is set but no provider is wired yet; logging instead.");
  }
  console.log(`[mail] to=${mail.to} subject=${mail.subject}\n${mail.text}`);
}
