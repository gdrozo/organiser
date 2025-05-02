import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY, // Securely stored API key
})

export async function POST(req) {
  try {
    // Use Clerk's auth() function to check authentication
    const { userId } = await auth()

    // If the user is not signed in, return a 401 Unauthorized response
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access: Please sign in.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse the request body
    const { messages } = await req.json()

    const preparedMessages = []
    messages.map(message => {
      if (message.role === 'user') {
        message.content = `Classify this text: ${message.content}`
      }
      preparedMessages.push(message)
    })

    // Call the streamText function with the prepared messages
    const result = streamText({
      model: openrouter(process.env.MODEL_ID), // Dynamically fetch model ID
      system:
        'You classify medical text into a specific category. Just provide the classification NOT ANYTHING ELSE', // Define system behavior
      messages: preparedMessages, // Ensure chat context is passed
    })

    // Stream the response back to the client
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error handling chat:', error)
    return new Response(JSON.stringify({ error: 'Failed to handle chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function uploadTextToDrive(text) {
  // Get credentials and build service
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.file', // Use drive.file scope
  })
  const service = google.drive({ version: 'v3', auth })

  // Create a temporary file with the given text
  const tempFilePath = 'temp.txt'
  fs.writeFileSync(tempFilePath, text)

  const requestBody = {
    name: 'text.txt', // Set the file name
    fields: 'id',
  }

  const media = {
    mimeType: 'text/plain', // Set the MIME type to text/plain
    body: fs.createReadStream(tempFilePath),
  }

  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    })
    console.log('File Id:', file.data.id)

    // Delete the temporary file
    fs.unlinkSync(tempFilePath)

    return file.data.id
  } catch (err) {
    // TODO(developer) - Handle error
    console.error('Error uploading file:', err)
    throw err
  }
}
