import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY, // Ensure secure storage of the key
})

export async function POST(req) {
  try {
    const { text } = await req.json()

    const model = openrouter('openai/gpt-4o')
    const prompt = `Provide a more detailed classification for the following text: ${text}`

    const { text: specificResult } = await generateText({
      model,
      prompt,
    })

    return new Response(JSON.stringify({ specificResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching specific result:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch specific result' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
