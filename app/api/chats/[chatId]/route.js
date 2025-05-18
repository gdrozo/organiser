import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deleteChat } from '@/logic/Chats'

// Delete a chat
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { chatId } = await params

    if (!chatId) {
      return new NextResponse('Invalid chat ID', { status: 400 })
    }

    await deleteChat(userId, chatId)

    return new NextResponse('Chat deleted', { status: 200 })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
