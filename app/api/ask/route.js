import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { GetCategories, getText } from '@/logic/Categories'
import { generateText } from 'ai'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY, // Securely stored API key
})

const SYSTEM_PROMPT = `GIVEN A QUESTION, SELECT FILES FROM THE LIST BELOW SO YOU CAN BE GIVEN THE FILE CONTENT TO ANSWER THE QUESTION. 
RETURN THE FILE CONTENT AS A STRING OF COMMA SEPARATED FILE NAMES. 
DO NOT RETURN ANYTHING ELSE.
FILE LIST:`

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
      const newMessage = { ...message }
      if (message.role === 'user') {
        newMessage.content = `QUESTION: "${message.content}" What files from the list do you need to retrieve the answer? respond JUST with a list them separated by a comma. do not respond with anything else.`
      }
      preparedMessages.push(message)
    })

    const categories = await GetCategories()

    let systemPrompt = SYSTEM_PROMPT

    categories.map(category => {
      systemPrompt += `${category},`
    })

    const response = await generateText({
      model: openrouter(process.env.MODEL_ID), // Dynamically fetch model ID
      system: systemPrompt, // Define system behavior
      messages: preparedMessages, // Ensure chat context is passed
    })

    // Stream the response back to the client
    const selectedFiles = response.text.replaceAll(/\n/g, '').split(',')

    console.log('selectedFiles', selectedFiles)

    let contents = ''
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const text = await getText(file)
      contents += text
    }

    const lastUserMessage =
      messages.length - 2 < 0 ? messages[0] : messages[messages.length - 2]

    const result = streamText({
      model: openrouter(process.env.MODEL_ID), // Dynamically fetch model ID
      system: 'ANSWER THE QUESTION COMPLETELY BASED ON THIS TEXT: ' + contents, // Define system behavior
      messages: [lastUserMessage], // Ensure chat context is passed
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error handling chat:', error)
    return new Response(JSON.stringify({ error: 'Failed to handle chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
