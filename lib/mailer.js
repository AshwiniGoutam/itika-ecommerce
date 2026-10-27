import nodemailer from 'nodemailer';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const shell = (inner) => `
<div style="background:#EEF2FA;padding:32px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
    <div style="background:#0A1A4A;padding:24px 28px;color:#fff">
      <div style="font-size:22px;font-weight:800;letter-spacing:2px">ITIKA<span style="color:#FF6A13">.</span></div>
      <div style="font-size:12px;opacity:.7;margin-top:4px">E-commerce growth partner</div>
    </div>
    <div style="padding:28px;color:#0F1B3D;font-size:15px;line-height:1.6">${inner}</div>
    <div style="height:6px;background:#FF6A13"></div>
  </div>
</div>`;

export async function sendLeadEmails(lead, brand = {}) {
  if (!smtpConfigured()) return { skipped: true };
  const t = getTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Business', lead.business],
    ['Marketplaces', (lead.platforms || []).join(', ')],
    ['Monthly sales', lead.revenue],
    ['Message', lead.message],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#6B7699;width:140px;vertical-align:top">${k}</td><td style="padding:8px 12px;font-weight:600">${esc(v)}</td></tr>`
    )
    .join('');

  await t.sendMail({
    from,
    to: process.env.LEAD_NOTIFY_TO || process.env.SMTP_USER,
    replyTo: lead.email || undefined,
    subject: `New lead: ${lead.name}${lead.business ? ` (${lead.business})` : ''}`,
    html: shell(`
      <h2 style="margin:0 0 16px;font-size:20px">New enquiry from the website</h2>
      <table style="width:100%;border-collapse:collapse;background:#F6F8FD;border-radius:12px">${rows}</table>
      <p style="margin-top:20px;font-size:13px;color:#6B7699">Received ${new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    `),
  });

  if (lead.email && process.env.SEND_AUTO_REPLY !== 'false') {
    await t.sendMail({
      from,
      to: lead.email,
      subject: `We received your enquiry — ${brand.fullName || 'Itika E-Commerce'}`,
      html: shell(`
        <h2 style="margin:0 0 12px;font-size:20px">Hi ${esc(lead.name.split(' ')[0])},</h2>
        <p>Thanks for reaching out. Our team will review your store and call you within 24 hours with your free account audit.</p>
        <p>Need us sooner? Call <a style="color:#FF6A13" href="tel:${esc(brand.phone)}">${esc(brand.phone)}</a> or reply to this email.</p>
        <p style="margin-top:24px">— Team ${esc(brand.fullName || 'Itika E-Commerce')}</p>
      `),
    });
  }
  return { sent: true };
}
