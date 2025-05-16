import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { getCategories, getText } from '@/logic/Categories'
import { generateText } from 'ai'
import { checkAuth } from '@/utils/auth'
import { streamTextTunnel } from '@/utils/streamHelper'
import { createChat, updateChat } from '@/logic/Chats'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY, // Securely stored API key
})

const SYSTEM_PROMPT = `GIVEN A QUESTION, SELECT FILES FROM THE LIST BELOW SO YOU CAN BE GIVEN THE FILE CONTENT TO ANSWER THE QUESTION. 
RETURN THE FILE CONTENT AS A STRING OF COMMA SEPARATED FILE NAMES. 
DO NOT RETURN ANYTHING ELSE.
FILE LIST:`

export async function POST(req) {
  debugger
  try {
    const userId = await checkAuth()
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
    const { messages, id } = await req.json()

    // Check if the request body is valid
    if (!messages || !Array.isArray(messages) || messages.length < 1) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request body: messages is required.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const tunnel = await streamTextTunnel(async tunnel => {
      debugger
      try {
        let preparedMessages = [...messages]
        const lastIndex = preparedMessages.length - 1

        preparedMessages[lastIndex] = structuredClone(
          preparedMessages[lastIndex]
        )

        preparedMessages[
          lastIndex
        ].content = `QUESTION: "${preparedMessages[lastIndex].content}" What files from the list do you need to retrieve the answer? respond JUST with a list them separated by a comma. do not respond with anything else.`

        tunnel.sendMessage('loading categories')
        const categories = await getCategories()

        let systemPrompt = SYSTEM_PROMPT

        categories.map(category => {
          systemPrompt += `${category},`
        })

        tunnel.sendMessage('selecting files')

        const response = await generateText({
          model: openrouter(process.env.MODEL_ID), // Dynamically fetch model ID
          system: systemPrompt, // Define system behavior
          messages: preparedMessages, // Ensure chat context is passed
        })

        // Stream the response back to the client
        const selectedFiles = response.text.replaceAll(/\n/g, '').split(',')

        let contents = ''
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          tunnel.sendMessage('getting file: ' + file + '.txt')
          const text = await getText(file)
          contents += text
        }

        tunnel.sendMessage('asking AI')

        const result = await generateText({
          model: openrouter(process.env.MODEL_ID), // Dynamically fetch model ID
          system:
            'ANSWER THE QUESTION COMPLETELY BASED ON THIS TEXT: ' + contents, // Define system behavior
          messages: messages, // Ensure chat context is passed
        })

        tunnel.sendResponse(result.text)

        const fullMessages = [
          ...messages,
          {
            content: result.text,
            role: 'assistant',
            id: `${messages.length + 1}`,
          },
        ]

        if (!id)
          await createChat(userId, {
            messages: fullMessages,
          })
        else await updateChat(userId, id, { messages: fullMessages })
      } catch (error) {
        debugger
        console.error('Error handling chat:', error)
        tunnel.sendError(error)
      } finally {
        tunnel.close()
      }
    })

    return tunnel.response
  } catch (error) {
    console.error('Error handling chat:', error)
    return new Response(JSON.stringify({ error: 'Failed to handle chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
