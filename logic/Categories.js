import { google } from 'googleapis'
import { auth, currentUser } from '@clerk/nextjs/server'
import db from '@/logic/firebaseAdmin'
import { checkAuth, getUserEmail } from '@/utils/auth'
import { getDrive, getFile, getFiles, getFolderId, getUser } from './db'
import fs from 'fs'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI =
  process.env.ENV === 'dev'
    ? process.env.DEV_REDIRECT_URI
    : process.env.REDIRECT_URI
const FOLDER_NAME = process.env.GOOGLE_DRIVE_FOLDER_NAME

const googleAuth = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

export async function GetCategories() {
  if (!(await checkAuth())) throw new Error('Unauthorized access')

  // Use Clerk SDK to fetch user details
  const userEmail = await getUserEmail()

  if (!userEmail) {
    throw new Error('User email is required to retrieve tokens.')
  }

  const files = await getFiles(userEmail)

  if (!files) return []

  // Extract file names
  const fileNames = files.map(file => file.name)

  return fileNames
}

export async function addCategory(category, text) {
  try {
    // Authenticate the request
    const { userId } = await auth()

    // If the user is not signed in, return a 401 Unauthorized response
    if (!userId) {
      throw new Error('Unauthorized access')
    }

    // Use Clerk SDK to fetch user details
    const userEmail = (await currentUser()).emailAddresses[0]?.emailAddress

    // Extract the user's email
    //const userEmail = user.emailAddresses[0]?.emailAddress

    if (!userEmail) {
      throw new Error('User email is required to retrieve tokens.')
    }

    // Fetch user's tokens from Firestore
    const userRef = db.collection('users').doc(userEmail)
    const userSnapshot = await userRef.get()

    if (!userSnapshot.exists) {
      throw new Error('No tokens found for the given user.')
    }

    const tokens = userSnapshot.data()

    // Set credentials to authenticate with Google Drive API
    googleAuth.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    })

    const drive = google.drive({ version: 'v3', auth: googleAuth })

    // Search for the folder by name
    let folderResponse = await drive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    })

    let folderId

    if (!folderResponse.data.files.length) {
      // Create the folder if it doesn't exist
      folderResponse = await drive.files.create({
        requestBody: {
          name: FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        },
      })
      folderId = folderResponse.data.id
    } else {
      folderId = folderResponse.data.files[0].id
    }

    // Create a new file in the folder
    const fileResponse = await drive.files.create({
      media: {
        mimeType: 'text/plain',
        body: text,
      },
      requestBody: {
        name: category,
        fields: 'id',

        parents: [folderId],
      },
    })

    const fileId = fileResponse.data.id

    // Add the file to the folder
    await drive.files.update({
      fileId,
      addParents: folderId,
      removeParents: null,
      fields: 'id, parents',
    })

    return category
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function addText(category, text) {
  try {
    if (!(await checkAuth())) throw new Error('Unauthorized access')

    // Use Clerk SDK to fetch user details
    const userEmail = await getUserEmail()

    if (!userEmail)
      throw new Error('User email is required to retrieve tokens.')

    const drive = await getDrive(null, userEmail)
    let file = await getFile(userEmail, category, drive)

    console.log('file', file)

    if (file) {
      const updatedContent = file.text + '\n' + text

      // Create a temporary file with the updated content
      const tempFilePath = 'temp.txt'
      fs.writeFileSync(tempFilePath, updatedContent)

      const media = {
        mimeType: 'text/plain', // Set the MIME type to text/plain
        body: fs.createReadStream(tempFilePath),
      }

      // Update the file
      await drive.files.update({
        fileId: file.fileId,
        media: media,
      })

      // Delete the temporary file
      fs.unlinkSync(tempFilePath)

      console.log('File updated successfully')
      return file.fileId
    } else {
      const parentFolderId = await getFolderId(userEmail, drive)

      // File doesn't exist, create it
      // Create a temporary file with the given text
      const tempFilePath = 'temp.txt'
      fs.writeFileSync(tempFilePath, text)

      const requestBody = {
        name: category, // Set the file name
        fields: 'id',
        parents: [parentFolderId],
      }

      const media = {
        mimeType: 'text/plain', // Set the MIME type to text/plain
        body: fs.createReadStream(tempFilePath),
      }

      try {
        file = await drive.files.create({
          requestBody,
          media: media,
        })
        console.log('File Id:', file.data.id)
      } catch (error) {
        // The folder doesn't exist, create it
        await addCategory(category, text)
        return
      }

      // Delete the temporary file
      fs.unlinkSync(tempFilePath)

      return file.data.id
    }
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function getText(category) {
  try {
    // Authenticate the request
    const { userId } = await auth()

    // If the user is not signed in, return a 401 Unauthorized response
    if (!userId) {
      throw new Error('Unauthorized access')
    }

    // Use Clerk SDK to fetch user details
    const userEmail = (await currentUser()).emailAddresses[0]?.emailAddress

    return (await getFile(userEmail, category)).text
  } catch (error) {
    console.error('Error retrieving text of category:', category, '\n', error)
    throw error
  }
}
