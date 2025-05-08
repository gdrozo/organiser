'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs' // Assuming Clerk for auth
import { Button } from '@/components/ui/button'

let listeners = []

export function onChatClick(listenerParam) {
  listeners.push(listenerParam)
}

const ChatList = ({ onClick }) => {
  const { isLoading } = useAuth()
  const [chats, setChats] = useState([])
  const [loadingChats, setLoadingChats] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchChats() {
      if (isLoading) {
        setLoadingChats(false)
        return
      }

      try {
        setLoadingChats(true)
        const response = await fetch('/api/chats')
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const userChats = await response.json()
        setChats(userChats ? Object.values(userChats) : []) // Assuming chats are stored as an object with user ID as key
        console.log(
          'userChats',
          userChats ? Object.values(userChats) : userChats
        )
      } catch (err) {
        setError(err)
        console.error('Error fetching chats:', err)
      } finally {
        setLoadingChats(false)
      }
    }

    fetchChats()
  }, [isLoading])

  if (isLoading || loadingChats) {
    return <div>Loading chats...</div>
  }

  if (error) {
    return <div>Error loading chats: {error.message}</div>
  }

  if (!chats || chats.length === 0) {
    return <div>No chats found.</div>
  }

  const handleClick = chat => {
    listeners.forEach(listener => listener(chat))
    onClick && onClick(chat)
  }

  return (
    <div className='chat-list'>
      {chats.map((chat, index) => (
        <Button
          onClick={() => handleClick(chat)}
          className='gap-1 text-gray-800 ml-0 pl-0 hover:text-gray-600 cursor-pointer text-base flex items-center bg-transparent hover:bg-transparent shadow-none'
          key={index}
        >
          {/* Assuming each chat object has a 'name' or 'title' property */}
          {chat?.messages[0]?.content}
        </Button>
      ))}
    </div>
  )
}

export default ChatList
