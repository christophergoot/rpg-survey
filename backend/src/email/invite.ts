const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendInvitationEmail(params: {
  invitedEmail: string;
  surveyTitle: string;
  inviterDisplayName: string;
  token: string;
  frontendOrigin: string;
  expiresAt: Date;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping invitation email");
    return;
  }

  const {
    invitedEmail,
    surveyTitle,
    inviterDisplayName,
    token,
    frontendOrigin,
    expiresAt,
  } = params;
  const acceptUrl = `${frontendOrigin}/#/invite/${token}`;
  const expiryText = expiresAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "RPG Survey <notifications@resend.dev>",
      to: invitedEmail,
      subject: `You've been invited to co-administer "${surveyTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 40px 20px; margin: 0;">
          <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; border: 1px solid #0066ff33;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="margin-bottom: 8px;">
                <svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="d20Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#00d9ff"/>
                      <stop offset="100%" style="stop-color:#0066ff"/>
                    </linearGradient>
                  </defs>
                  <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="url(#d20Gradient)" stroke="#ffffff" stroke-width="2"/>
                  <polygon points="50,5 95,27.5 50,50 5,27.5" fill="rgba(255,255,255,0.15)"/>
                  <polygon points="95,27.5 95,72.5 50,50" fill="rgba(0,0,0,0.1)"/>
                  <polygon points="50,95 5,72.5 50,50 95,72.5" fill="rgba(0,0,0,0.2)"/>
                  <text x="50" y="58" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-size="24" font-weight="bold">20</text>
                </svg>
              </div>
              <h1 style="margin: 0; font-size: 24px; color: #00d9ff;">Survey Invitation</h1>
            </div>
            <div style="background: #0a0a0f; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 14px;">Invited by</p>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #00d9ff;">${inviterDisplayName}</p>
            </div>
            <div style="background: #0a0a0f; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 14px;">Survey</p>
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">${surveyTitle}</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${acceptUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00d9ff, #0066ff); color: #ffffff; font-weight: 700; font-size: 16px; text-decoration: none; border-radius: 8px;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0 0 8px 0;">
              This invitation expires on ${expiryText}.
            </p>
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
              If you don't have an account yet, you'll be prompted to create one.
            </p>
          </div>
        </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Resend error (invitation):", text);
  }
}
