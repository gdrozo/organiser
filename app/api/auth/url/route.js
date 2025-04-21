import { google } from 'googleapis'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI =
  process.env.ENV === 'dev'
    ? process.env.DEV_REDIRECT_URI
    : process.env.REDIRECT_URI

export async function GET() {
  try {
    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    )

    // Generate the auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // To get refresh tokens
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.email',
      ], // Adjust scopes as needed
      prompt: 'consent', // Force re-consent to refresh token
    })

    return new Response(JSON.stringify({ authUrl }), { status: 200 })
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate authorization URL' }),
      { status: 500 }
    )
  }
}
