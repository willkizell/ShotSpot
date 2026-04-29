import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const ADMIN_EMAIL = "wkizell@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function sendCoachSubmissionAlert({
  coachName,
  coachEmail,
  events,
  location,
}: {
  coachName: string;
  coachEmail: string;
  events: string[];
  location: string;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New coach application: ${coachName}`,
    html: `
      <h2>New coach application on ShotSpot</h2>
      <p><strong>Name:</strong> ${coachName}</p>
      <p><strong>Email:</strong> ${coachEmail}</p>
      <p><strong>Events:</strong> ${events.map((e) => e.replace("_", " ")).join(", ")}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><a href="${SITE_URL}/admin/coaches" style="background:#007B6F;color:white;padding:10px 20px;text-decoration:none;display:inline-block;margin-top:12px;">Review application →</a></p>
    `,
  });
}

export async function sendCoachApprovedEmail({
  coachName,
  coachEmail,
  coachId,
}: {
  coachName: string;
  coachEmail: string;
  coachId: string;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: coachEmail,
    subject: "You're approved on ShotSpot! 🎉",
    html: `
      <h2>Welcome to ShotSpot, ${coachName}!</h2>
      <p>Your coaching profile has been reviewed and <strong>approved</strong>. You're now live on the marketplace.</p>
      <p>Athletes can discover your profile and apply to work with you.</p>
      <p><a href="${SITE_URL}/coaches/${coachId}" style="background:#007B6F;color:white;padding:10px 20px;text-decoration:none;display:inline-block;margin-top:12px;">View your profile →</a></p>
      <p style="margin-top:24px;color:#888;font-size:13px;">ShotSpot — The throws coaching marketplace</p>
    `,
  });
}

export async function sendCoachRejectedEmail({
  coachName,
  coachEmail,
  reason,
}: {
  coachName: string;
  coachEmail: string;
  reason: string;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: coachEmail,
    subject: "Update on your ShotSpot application",
    html: `
      <h2>Hi ${coachName},</h2>
      <p>Thank you for applying to ShotSpot. After reviewing your application, we're unable to approve your profile at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>You're welcome to update your profile and resubmit. If you have questions, reply to this email.</p>
      <p><a href="${SITE_URL}/coach/onboarding" style="background:#000;color:white;padding:10px 20px;text-decoration:none;display:inline-block;margin-top:12px;">Update and resubmit →</a></p>
      <p style="margin-top:24px;color:#888;font-size:13px;">ShotSpot — The throws coaching marketplace</p>
    `,
  });
}
