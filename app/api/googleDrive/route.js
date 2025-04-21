import { google } from 'googleapis'

export async function POST(req) {
  const { fileName, content } = await req.json()

  // Fetch the stored access token (replace with secure storage)
  const accessToken = '<FETCH_FROM_BACKEND>'

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const drive = google.drive({ version: 'v3', auth })

  try {
    // Search for the file by name
    const searchResponse = await drive.files.list({
      q: `name='${fileName}' and mimeType='application/vnd.google-apps.document'`,
      fields: 'files(id, name)',
    })

    let fileId

    if (searchResponse.data.files.length === 0) {
      // File does not exist, create a new one
      const createResponse = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: 'application/vnd.google-apps.document',
        },
        fields: 'id',
      })

      fileId = createResponse.data.id
    } else {
      // File exists
      fileId = searchResponse.data.files[0].id
    }

    // Update file content
    await drive.files.update({
      fileId: fileId,
      media: {
        mimeType: 'text/plain',
        body: content,
      },
    })

    return new Response(
      JSON.stringify({ message: 'File updated successfully', fileId }),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Error updating the file' }), {
      status: 500,
    })
  }
}
