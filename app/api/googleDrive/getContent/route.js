import { getText } from '@/logic/Categories'

export async function POST(req) {
  try {
    const { category } = await req.json()

    const text = await getText(category)

    return new Response(JSON.stringify({ content: text }), { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized access') {
      return new Response(JSON.stringify({ error: 'Unauthorized access' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
