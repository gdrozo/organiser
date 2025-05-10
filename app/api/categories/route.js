import { NextResponse } from 'next/server'
import { GetCategories } from '@/logic/Categories'

export async function GET(request) {
  try {
    console.log('Categories GET')
    const categories = await GetCategories()
    return NextResponse.json(categories)
    // Catch token expired
  } catch (error) {
    if (error.message === 'Tokens expired') {
      console.log('inner error')
      const url = new URL(request.url)
      const origin = url.origin

      // Construct the full redirect URL
      const redirectUrl = `${origin}/auth`

      // Not authorized
      return NextResponse.json({ redirect: redirectUrl }, { status: 401 })
    }
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
