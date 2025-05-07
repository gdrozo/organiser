import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getChats } from '@/logic/Chats'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chats = await getChats(userId)

    return NextResponse.json(chats)
  } catch (error) {
    console.error('Error fetching chats:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
