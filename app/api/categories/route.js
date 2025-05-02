import { NextResponse } from 'next/server'
import { GetCategories } from '@/logic/Categories'

export async function GET() {
  try {
    const categories = await GetCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
