import { GetCategories, addCategory, addText } from '@/logic/Categories'

export async function GET(req) {
  try {
    const categories = await GetCategories()
    return new Response(JSON.stringify({ categories }), { status: 200 })
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

export async function POST(req) {
  try {
    const { category, text } = await req.json()

    await addText(category, text)
    return new Response(JSON.stringify({ category }), { status: 200 })
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
