import { auth, currentUser } from '@clerk/nextjs/server'

export async function checkAuth() {
  // Use Clerk's auth() function to check authentication
  const { userId } = await auth()

  return userId
}

export async function getUserEmail() {
  try {
    return (await currentUser()).emailAddresses[0]?.emailAddress
  } catch (error) {
    return null
  }
}

export function hasTokenExpired(tokenObject) {
  const expiryDate = new Date(tokenObject.expiryDate)

  // Check if the token has expired
  if (expiryDate < new Date()) {
    return true
  }

  return false
}
