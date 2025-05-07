import { auth, currentUser } from '@clerk/nextjs/server'
import db from '@/logic/firebaseAdmin'

// Function to create or update a user's chat list
export async function createChat(userId, chatData) {
  try {
    // Authenticate the request
    const { userId: authenticatedUserId } = await auth()

    // If the user is not signed in or the provided userId doesn't match the authenticated user, return a 401 Unauthorized response
    if (!authenticatedUserId || authenticatedUserId !== userId)
      throw new Error('Unauthorized access')

    const docRef = db.collection('chats').doc(authenticatedUserId)
    const collectionRef = docRef.collection('history') // Using a subcollection for auto-generated IDs
    const res = await collectionRef.add(chatData)
    console.log('Added document with ID: ', res.id)
    return res.id
  } catch (e) {
    console.error('Error adding document: ', e)
    throw e
  }
}

// Function to update a specific chat for a user
export async function updateChat(userId, chatId, chatData) {
  try {
    // Authenticate the request
    const { userId: authenticatedUserId } = await auth()

    // If the user is not signed in or the provided userId doesn't match the authenticated user, return a 401 Unauthorized response
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      throw new Error('Unauthorized access')
    }

    // Reference the specific chat document within the 'history' subcollection
    const chatRef = db
      .collection('chats')
      .doc(userId)
      .collection('history')
      .doc(chatId)

    // Update the chat data
    await chatRef.update(chatData)

    return { success: true, message: 'Chat updated successfully' }
  } catch (error) {
    console.error('Error updating chat:', error)
    throw error
  }
}

// Function to delete a specific chat for a user
export async function deleteChat(userId, chatId) {
  try {
    // Authenticate the request
    const { userId: authenticatedUserId } = await auth()

    // If the user is not signed in or the provided userId doesn't match the authenticated user, return a 401 Unauthorized response
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      throw new Error('Unauthorized access')
    }

    // Reference the specific chat document within the 'history' subcollection
    const chatRef = db
      .collection('chats')
      .doc(userId)
      .collection('history')
      .doc(chatId)

    // Delete the chat document
    await chatRef.delete()

    return { success: true, message: 'Chat deleted successfully' }
  } catch (error) {
    console.error('Error deleting chat:', error)
    throw error
  }
}

// Function to get all chats for a user from the 'history' subcollection
export async function getChats(userId) {
  try {
    // Authenticate the request
    const { userId: authenticatedUserId } = await auth()

    // If the user is not signed in or the provided userId doesn't match the authenticated user, return a 401 Unauthorized response
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      throw new Error('Unauthorized access')
    }

    // Reference the 'history' subcollection for the user
    const historyCollectionRef = db
      .collection('chats')
      .doc(userId)
      .collection('history')

    // Get all documents from the 'history' subcollection
    const historySnapshot = await historyCollectionRef.get()

    if (historySnapshot.empty) {
      return [] // Return an empty array if no chats are found
    }

    // Map the documents to include their IDs and data
    const chats = historySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return chats
  } catch (error) {
    console.error('Error getting chats:', error)
    throw error
  }
}
