import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'localhost',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendLeadNotification(lead: {
  name:    string
  email:   string
  company: string
  service: string
  message: string
}) {
  const notify = process.env.NOTIFY_EMAIL
  if (!notify) return

  await transporter.sendMail({
    from:    `"Alini Solutions Website" <${process.env.SMTP_USER}>`,
    to:      notify,
    subject: `New Lead: ${lead.name} — ${lead.service || 'General Enquiry'}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#C8102E;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:1.4rem;">New Contact Lead</h1>
        </div>
        <div style="background:#f9f9f9;padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${lead.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Company</td><td style="padding:8px 0;">${lead.company || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Service</td><td style="padding:8px 0;">${lead.service || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;"/>
          <p style="color:#666;margin:0 0 8px;">Message:</p>
          <p style="background:#fff;padding:16px;border-left:3px solid #C8102E;margin:0;">${lead.message}</p>
        </div>
        <div style="padding:16px 32px;text-align:center;color:#999;font-size:0.8rem;">
          Alini Solutions · alinisolution.co.ke
        </div>
      </div>
    `,
  })
}

export async function sendLeadAutoReply(lead: { name: string; email: string }) {
  await transporter.sendMail({
    from:    `"Alini Solutions" <${process.env.SMTP_USER}>`,
    to:      lead.email,
    subject: 'We received your message — Alini Solutions',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0a0a0a;padding:24px 32px;">
          <h1 style="color:#F5F0E8;margin:0;font-size:1.3rem;">Alini <span style="color:#E8601C;">Solutions</span></h1>
        </div>
        <div style="padding:32px;">
          <p>Hi ${lead.name},</p>
          <p>Thank you for reaching out. We've received your enquiry and one of our engineers will get back to you within <strong>one business day</strong>.</p>
          <p style="margin-top:24px;">In the meantime, feel free to explore our services at <a href="https://alinisolution.co.ke">alinisolution.co.ke</a>.</p>
          <p style="margin-top:32px;color:#666;">Warm regards,<br/><strong>The Alini Solutions Team</strong></p>
        </div>
        <div style="background:#f5f5f5;padding:16px 32px;text-align:center;color:#999;font-size:0.8rem;">
          Alini Solutions · Nairobi, Kenya · alinisolution.co.ke
        </div>
      </div>
    `,
  })
}
