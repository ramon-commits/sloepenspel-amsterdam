import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Body = {
  company?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  groupSize?: string;
  date?: string;
  altDate?: string;
  location?: string;
  honeypot?: string;
};

const FROM = "Sloepenspel Amsterdam <amsterdam@sloepenspel.nl>";
const TO = "amsterdam@sloepenspel.nl";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateNL(iso: string): string {
  if (!iso) return "Niet opgegeven";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function isValidPhone(v: string): boolean {
  const digits = v.replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — if filled, silently accept and discard
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Server-side validation
  const company = (body.company || "").trim();
  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const groupSize = (body.groupSize || "").trim();
  const date = (body.date || "").trim();
  const altDate = (body.altDate || "").trim();
  const location = (body.location || "").trim();

  if (!company || !firstName || !lastName || !phone || !email || !groupSize || !date) {
    return NextResponse.json({ error: "Niet alle verplichte velden zijn ingevuld." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Ongeldig telefoonnummer." }, { status: 400 });
  }
  const groupNum = Number(groupSize);
  if (!Number.isFinite(groupNum) || groupNum < 12) {
    return NextResponse.json({ error: "Aantal personen moet minimaal 12 zijn." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    return NextResponse.json({ error: "E-mailconfiguratie ontbreekt." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const fullName = `${firstName} ${lastName}`;
  const dateNL = formatDateNL(date);
  const altDateNL = altDate ? formatDateNL(altDate) : "Niet opgegeven";
  const locationLabel = location || "Geen voorkeur";

  // ---------- Internal notification ----------
  const internalSubject = `Nieuwe offerte-aanvraag van ${company}`;
  const internalText =
    `Bedrijf: ${company}\n` +
    `Naam: ${fullName}\n` +
    `Telefoon: ${phone}\n` +
    `Email: ${email}\n` +
    `Aantal personen: ${groupNum}\n` +
    `Gewenste datum: ${dateNL}\n` +
    `Alternatieve datum: ${altDateNL}\n` +
    `Voorkeurlocatie: ${locationLabel}\n`;
  const internalHtml = `
<!doctype html>
<html lang="nl">
<body style="margin:0; padding:24px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#FAF7F2; color:#1B2A4A;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden;">
    <tr>
      <td style="background:#1B2A4A; padding:24px 28px; color:#ffffff;">
        <p style="margin:0 0 4px 0; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:#E8866A; font-weight:600;">Nieuwe aanvraag</p>
        <h1 style="margin:0; font-size:22px; font-weight:600; line-height:1.3;">${escapeHtml(company)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          ${row("Naam", fullName)}
          ${row("Telefoon", phone, `tel:${phone.replace(/[^\d+]/g, "")}`)}
          ${row("Email", email, `mailto:${email}`)}
          ${row("Aantal personen", String(groupNum))}
          ${row("Gewenste datum", dateNL)}
          ${row("Alternatieve datum", altDateNL)}
          ${row("Voorkeurlocatie", locationLabel)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // ---------- Confirmation email to applicant ----------
  const confirmSubject = `Bedankt voor je aanvraag, ${firstName}!`;
  const confirmText =
    `Hoi ${firstName},\n\n` +
    `Bedankt voor je interesse in het Sloepenspel. We hebben je aanvraag ontvangen ` +
    `en nemen binnen één werkdag contact met je op.\n\n` +
    `Jouw gegevens:\n` +
    `Bedrijf: ${company}\n` +
    `Aantal personen: ${groupNum}\n` +
    `Gewenste datum: ${dateNL}\n` +
    `Alternatieve datum: ${altDateNL}\n` +
    `Voorkeurlocatie: ${locationLabel}\n\n` +
    `Heb je in de tussentijd vragen? Mail ons gerust op amsterdam@sloepenspel.nl.\n\n` +
    `Groet,\nTeam Sloepenspel Amsterdam`;
  const confirmHtml = `
<!doctype html>
<html lang="nl">
<body style="margin:0; padding:24px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#FAF7F2; color:#1B2A4A; line-height:1.55;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(27,42,74,0.06);">
    <tr>
      <td style="background:#1B2A4A; padding:32px 32px 24px 32px; color:#ffffff;">
        <p style="margin:0 0 6px 0; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#E8866A; font-weight:600;">Sloepenspel Amsterdam</p>
        <h1 style="margin:0; font-family:Georgia, serif; font-size:26px; font-weight:600; line-height:1.25;">Bedankt voor je aanvraag, ${escapeHtml(firstName)}!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 8px 32px;">
        <p style="margin:0 0 16px 0; font-size:15px;">Hoi ${escapeHtml(firstName)},</p>
        <p style="margin:0 0 18px 0; font-size:15px;">
          Bedankt voor je interesse in het Sloepenspel. We hebben je aanvraag ontvangen en
          nemen <strong style="color:#E8866A;">binnen één werkdag</strong> contact met je op.
        </p>
        <p style="margin:24px 0 10px 0; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:#9CA3AF; font-weight:600;">Jouw gegevens</p>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FAF7F2; border-radius:10px; padding:6px 14px;">
          ${row("Bedrijf", company)}
          ${row("Aantal personen", String(groupNum))}
          ${row("Gewenste datum", dateNL)}
          ${row("Alternatieve datum", altDateNL)}
          ${row("Voorkeurlocatie", locationLabel)}
        </table>
        <p style="margin:24px 0 6px 0; font-size:14px;">
          Heb je in de tussentijd vragen? Mail ons gerust op
          <a href="mailto:amsterdam@sloepenspel.nl" style="color:#E8866A; text-decoration:none; font-weight:600;">amsterdam@sloepenspel.nl</a>.
        </p>
        <p style="margin:18px 0 0 0; font-size:14px;">Groet,<br/><strong>Team Sloepenspel Amsterdam</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px 28px 32px; border-top:1px solid #EAE3D7; margin-top:18px; font-size:11px; color:#9CA3AF;">
        Sloepenspel Amsterdam · Het interactieve bedrijfsuitje op het water
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    // Send both in parallel
    const [internal, confirm] = await Promise.all([
      resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: internalSubject,
        text: internalText,
        html: internalHtml,
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TO,
        subject: confirmSubject,
        text: confirmText,
        html: confirmHtml,
      }),
    ]);

    if (internal.error || confirm.error) {
      console.error("Resend errors", { internal: internal.error, confirm: confirm.error });
      return NextResponse.json({ error: "E-mail kon niet worden verzonden." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API /api/contact error", err);
    return NextResponse.json({ error: "Er ging iets mis bij het versturen." }, { status: 500 });
  }
}

function row(label: string, value: string, link?: string): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);
  const inner = link ? `<a href="${link}" style="color:#1B2A4A; text-decoration:none;">${safeValue}</a>` : safeValue;
  return `
    <tr>
      <td style="padding:8px 0; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:#9CA3AF; font-weight:600; width:42%; vertical-align:top;">${safeLabel}</td>
      <td style="padding:8px 0; font-size:14px; color:#1B2A4A; font-weight:500; vertical-align:top;">${inner}</td>
    </tr>`;
}
