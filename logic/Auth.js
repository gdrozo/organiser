import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'

const provider = new GoogleAuthProvider()

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log('User Info:', user)
  } catch (error) {
    console.error('Error during Google Sign-In:', error)
  }
}

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth)
    console.log('User signed out')
  } catch (error) {
    console.error('Error during sign-out:', error)
  }
}
