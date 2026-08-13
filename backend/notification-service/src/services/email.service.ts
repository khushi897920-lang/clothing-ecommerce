import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.mailtrap.io";
const smtpPort = parseInt(process.env.SMTP_PORT || "2525", 10);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const emailFrom = process.env.EMAIL_FROM || "YUGEN Fashion <no-reply@yugen.com>";

let transporter: nodemailer.Transporter | null = null;

if (smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!transporter) {
    console.log(`[EmailService] Configuration pending for recipient: ${options.to} (Subject: "${options.subject}")`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`[EmailService] Email sent to ${options.to}`);
    return true;
  } catch (err) {
    console.error(`[EmailService] Error sending email to ${options.to}:`, err);
    return false;
  }
}
