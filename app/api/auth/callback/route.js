import { createUser } from '@/logic/db'
import db from '@/logic/firebaseAdmin'
import { google } from 'googleapis'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI =
  process.env.ENV === 'dev'
    ? process.env.DEV_REDIRECT_URI
    : process.env.REDIRECT_URI

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export async function GET(req) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response(
      JSON.stringify({ error: 'Authorization code is missing' }),
      { status: 400 }
    )
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await auth.getToken(code)
    auth.setCredentials(tokens)

    // Use the Google OAuth2 API to fetch user profile information
    const oauth2 = google.oauth2({
      auth: auth,
      version: 'v2',
    })

    const userInfo = await oauth2.userinfo.get()
    const userEmail = userInfo.data.email

    //tokens.expiry_date = tokens.expiry_date + Date.now()

    console.log('tokens', tokens)

    createUser(userEmail, tokens)

    // Redirect back to the app with success status
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    })
  } catch (error) {
    console.error('Error during callback:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve user information.' }),
      { status: 500 }
    )
  }
}
