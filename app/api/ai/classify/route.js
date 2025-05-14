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
    if (!userId)
      return new Response(
        JSON.stringify({ error: 'Unauthorized access: Please sign in.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )

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
        'Classify medical text into a specific category, be specific as this is a medical text. Just provide the classification NOT ANYTHING ELSE', // Define system behavior
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
