import { google } from 'googleapis'
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import db from '@/logic/firebaseAdmin'

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

    // List files in the folder
    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name)',
    })

    const files = filesResponse.data.files

    if (!files || files.length === 0) {
      return []
    }

    // Extract file names
    const fileNames = files.map(file => file.name)

    return fileNames
  } catch (error) {
    throw new Error('An error occurred while retrieving files.')
  }
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
        parents: [folderId],
        mimeType: 'application/vnd.google-apps.document',
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
      return []
    } else {
      folderId = folderResponse.data.files[0].id
    }

    // Get the file ID
    const fileResponse = await drive.files.list({
      q: `name='${category}' and mimeType='application/vnd.google-apps.document' and trashed=false`,
      fields: 'files(id, name)',
    })
    const fileId = fileResponse.data.files[0].id

    // Get the current file content
    const fileContentResponse = await drive.files.export({
      fileId: fileId,
      mimeType: 'text/plain',
    })
    const fileContent = fileContentResponse.data

    // Add text to the file
    await drive.files.update({
      fileId,
      fields: 'id, parents',
      media: {
        mimeType: 'text/plain',
        body: fileContent + '\n\n' + text,
      },
    })

    return category
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
      return []
    } else {
      folderId = folderResponse.data.files[0].id
    }

    // Get the file ID
    const fileResponse = await drive.files.list({
      q: `name='${category}' and mimeType='application/vnd.google-apps.document' and trashed=false`,
      fields: 'files(id, name)',
    })

    const fileId = fileResponse.data.files[0].id

    // Get the current file content
    const fileContentResponse = await drive.files.export({
      fileId: fileId,
      mimeType: 'text/plain',
    })
    const fileContent = fileContentResponse.data

    return fileContent
  } catch (error) {
    console.error('Error retrieving text of category:', category, '\n', error)
    throw error
  }
}
