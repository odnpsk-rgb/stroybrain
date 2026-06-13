import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass };
}

export function isMailConfigured() {
  return getSmtpConfig() !== null;
}

export async function sendContactNotification(data: ContactEmailPayload) {
  const smtp = getSmtpConfig();
  if (!smtp) {
    throw new Error(
      "Почта не настроена на сервере (SMTP_HOST, SMTP_USER, SMTP_PASS). Обратитесь к администратору сайта.",
    );
  }

  const to = process.env.NOTIFY_EMAIL ?? "odnpsk@gmail.com";
  const from = process.env.SMTP_FROM ?? smtp.user;

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const text = [
    `Имя: ${data.name}`,
    `Email: ${data.email}`,
    `Телефон: ${data.phone}`,
    `Тема: ${data.subject}`,
    "",
    data.message,
  ].join("\n");

  await transporter.sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `[Заявка с сайта] ${data.subject}`,
    text,
    html: `
      <p><strong>Имя:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      <p><strong>Телефон:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Тема:</strong> ${escapeHtml(data.subject)}</p>
      <hr />
      <p style="white-space: pre-wrap">${escapeHtml(data.message)}</p>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
