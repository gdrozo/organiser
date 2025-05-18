'use client'
import { useState, useEffect, use } from 'react'
import { useAuth } from '@clerk/nextjs' // Assuming Clerk for auth
import { Button } from '@/components/ui/button'
import { onChatCreated } from './Ask'

let listeners = []

export function onChatClick(listenerParam) {
  listeners.push(listenerParam)
}

const ChatList = ({ onClick, toggleEdit }) => {
  const { isLoading } = useAuth()
  const [chats, setChats] = useState([])
  const [loadingChats, setLoadingChats] = useState(true)
  const [error, setError] = useState(null)
  const [newChat, setNewChat] = useState()

  useEffect(() => {
    onChatCreated(chat => {
      console.log('new chat created', chat)
      setNewChat(chat)
    })
  }, [])

  useEffect(() => {
    if (newChat) {
      setChats([...chats, { messages: [newChat], id: chats.length + 1 }])
      setNewChat(undefined)
    } else console.log('newChat', newChat)
  }, [newChat])

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
    if (toggleEdit) {
      //Hit API to delete chat
      fetch(`/api/chats/${chat.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            console.log('Chat deleted successfully')

            // Remove the chat from the list
            const updatedChats = chats.filter(c => c.id !== chat.id)
            setChats(updatedChats)
          } else {
            console.error('Error deleting chat:', response.statusText)
          }
        })
        .catch(error => {
          console.error('Error deleting chat:', error)
        })
    } else {
      listeners.forEach(listener => listener(chat))
      onClick && onClick(chat)
    }
  }

  return (
    <div className='chat-list'>
      {chats.map((chat, index) => (
        <Button
          onClick={() => handleClick(chat)}
          className='lg:max-w-44 lg:w-44 justify-start gap-1 text-gray-800 ml-0 pl-0 hover:text-gray-600 cursor-pointer text-base flex items-center bg-transparent hover:bg-transparent shadow-none'
          key={index}
        >
          {toggleEdit ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#c43c3c'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='animate-bounce'
            >
              <path d='M18 6 6 18' />
              <path d='m6 6 12 12' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className=''
            >
              <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z' />
            </svg>
          )}
          {chat?.messages[0]?.content}
        </Button>
      ))}
    </div>
  )
}

export default ChatList
