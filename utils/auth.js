import { auth } from '@clerk/nextjs/server'

export async function checkAuth() {
  // Use Clerk's auth() function to check authentication
  const { userId } = await auth()

  return userId
}
