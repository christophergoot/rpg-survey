import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface NotifyRequest {
  surveyId: string
  playerName: string
  responseId: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { surveyId, playerName, responseId }: NotifyRequest = await req.json()

    if (!surveyId || !playerName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Create Supabase client with service role to access GM email
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Get survey details and GM email
    const { data: survey, error: surveyError } = await supabase
      .from("surveys")
      .select("title, created_by")
      .eq("id", surveyId)
      .single()

    if (surveyError || !survey) {
      console.error("Survey not found:", surveyError)
      return new Response(
        JSON.stringify({ error: "Survey not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Get GM's email from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      survey.created_by
    )

    if (userError || !userData?.user?.email) {
      console.error("GM email not found:", userError)
      return new Response(
        JSON.stringify({ error: "GM email not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const gmEmail = userData.user.email
    const surveyTitle = survey.title

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RPG Survey <notifications@resend.dev>",
        to: gmEmail,
        subject: `New survey response: ${surveyTitle}`,
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
                    <line x1="50" y1="5" x2="50" y2="50" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                    <line x1="95" y1="27.5" x2="50" y2="50" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                    <line x1="5" y1="27.5" x2="50" y2="50" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                    <line x1="95" y1="72.5" x2="50" y2="50" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
                    <line x1="5" y1="72.5" x2="50" y2="50" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
                    <line x1="50" y1="95" x2="50" y2="50" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
                    <text x="50" y="58" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-size="24" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">20</text>
                  </svg>
                </div>
                <h1 style="margin: 0; font-size: 24px; color: #00d9ff;">New Survey Response!</h1>
              </div>

              <div style="background: #0a0a0f; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 14px;">Survey</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">${surveyTitle}</p>
              </div>

              <div style="background: #0a0a0f; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 14px;">Player</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #00d9ff;">${playerName}</p>
              </div>

              <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 24px 0 0 0;">
                Log in to your dashboard to view the full response.
              </p>

            </div>
          </body>
          </html>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error("Resend error:", errorText)
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const result = await emailResponse.json()
    console.log("Email sent successfully:", result)

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
