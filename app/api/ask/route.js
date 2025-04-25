import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { GetCategories, getText } from '@/logic/Categories'
import { generateText } from 'ai'
import { checkAuth } from '@/utils/auth'
import { streamTextTunnel } from '@/utils/streamHelper'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY, // Securely stored API key
})

const SYSTEM_PROMPT = `GIVEN A QUESTION, SELECT FILES FROM THE LIST BELOW SO YOU CAN BE GIVEN THE FILE CONTENT TO ANSWER THE QUESTION. 
RETURN THE FILE CONTENT AS A STRING OF COMMA SEPARATED FILE NAMES. 
DO NOT RETURN ANYTHING ELSE.
FILE LIST:`

export async function POST(req) {
  try {
    // If the user is not signed in, return a 401 Unauthorized response
    if (!checkAuth()) {
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

    let preparedMessages = [...messages]
    const lastIndex = preparedMessages.length - 1

    preparedMessages[lastIndex] = structuredClone(preparedMessages[lastIndex])

    preparedMessages[
      lastIndex
    ].content = `QUESTION: "${preparedMessages[lastIndex].content}" What files from the list do you need to retrieve the answer? respond JUST with a list them separated by a comma. do not respond with anything else.`

    const tunnel = await streamTextTunnel()

    ;(async () => {
      tunnel.sendMessage('status:loading categories')
      const categories = await GetCategories()

      let systemPrompt = SYSTEM_PROMPT

      categories.map(category => {
        systemPrompt += `${category},`
      })

      tunnel.sendMessage('status:selecting files')

      console.log('preparedMessages', preparedMessages)
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
        tunnel.sendMessage('status:getting file: ' + file + '.txt')
        const text = await getText(file)
        contents += text
      }

      /*
      const lastUserMessage =
        messages.length - 2 < 0 ? messages[0] : messages[messages.length - 2]
*/
      tunnel.sendMessage('status:asking AI')

      console.log('messages', messages)
      const result = await generateText({
        model: openrouter(process.env.MODEL_ID), // Dynamically fetch model ID
        system:
          'ANSWER THE QUESTION COMPLETELY BASED ON THIS TEXT: ' + contents, // Define system behavior
        messages: messages, // Ensure chat context is passed
      })

      tunnel.sendMessage('response:' + result.text)

      tunnel.close()
    })()

    return tunnel.response
  } catch (error) {
    console.error('Error handling chat:', error)
    return new Response(JSON.stringify({ error: 'Failed to handle chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
