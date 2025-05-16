import db from '@/logic/firebaseAdmin'
import { google } from 'googleapis'

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

export async function getUser(userId) {
  try {
    const userRef = db.collection('users').doc(userId)
    const userSnapshot = await userRef.get()

    if (!userSnapshot.exists) {
      throw new Error('No tokens found for the given user.')
    }

    return userSnapshot.data()
  } catch (error) {
    throw new Error('No tokens found for the given user.')
  }
}

export async function createUser(userId, tokens) {
  const userRef = db.collection('users').doc(userId)

  await userRef.set(
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date.toString(),
    },
    { merge: true }
  )
}

async function getFolderIdFromFirebase(userId) {
  try {
    const folderRef = db.collection('folders').doc(userId)
    const folderSnapshot = await folderRef.get()

    if (!folderSnapshot.exists) return null

    return folderSnapshot.data()
  } catch (error) {
    console.error('Error getting folder:', error)
    throw new Error('No tokens found for the given user.')
  }
}

async function createFolder(userId, folderId) {
  const folderRef = db.collection('folders').doc(userId)

  await folderRef.set(
    {
      folderId: folderId,
    },
    { merge: true }
  )
}

export async function queryFolderId(userId, drive) {
  try {
    let folderId
    // Search for the folder by name
    let folderResponse = await drive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    })

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

    createFolder(userId, folderId)

    return folderId
  } catch (error) {
    console.error('Error getting folder:', error)
    throw new Error('No tokens found for the given user.')
  }
}

export async function getFolderId(userId, drive) {
  let folderId = await getFolderIdFromFirebase(userId)

  if (folderId) return folderId.folderId

  try {
    // Search for the folder by name
    let folderResponse = await drive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    })

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

    createFolder(userId, folderId)

    return folderId
  } catch (error) {
    console.error('Error getting folder:', error)
    throw new Error('No tokens found for the given user.')
  }
}

export async function getFile(userId, fileName, folderId, drive) {
  if (!userId) throw new Error('User id is required to retrieve tokens.')

  if (!drive) drive = await getDrive(null, userId)

  try {
    // Search for the file
    const res = await drive.files.list({
      q: `name='${fileName}' and '${folderId}' in parents and trashed=false and mimeType='text/plain'`,
      fields: 'files(id)',
      spaces: 'drive',
    })

    if (res.data.files.length > 0) {
      // File exists, download its content
      const fileId = res.data.files[0].id

      const getRes = await drive.files.get({
        fileId: fileId,
        alt: 'media',
      })

      return { text: getRes.data, fileId: fileId }
    } else {
      // File doesn't exist, return null
      return null
    }
  } catch (err) {
    // TODO(developer) - Handle error
    console.error('Error getting file content:', err)
    return null
  }
}

export async function getFiles(userId) {
  if (!userId) throw new Error('User email is required to retrieve tokens.')

  const tokens = await getUser(userId)

  // checking tokens
  if (!tokens) {
    console.Error('No tokens found for the given user.')
    throw new Error('Tokens expired')
  }

  const drive = await getDrive(tokens)

  let folderId = await getFolderId(userId, drive)
  let filesResponse

  try {
    // List files in the folder
    try {
      filesResponse = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false and mimeType='text/plain'`,
        fields: 'files(id, name)',
      })
    } catch (error) {
      if (error.message.startsWith('File not found')) {
        folderId = await queryFolderId(userId, drive)
        filesResponse = await drive.files.list({
          q: `'${folderId}' in parents and trashed=false and mimeType='text/plain'`,
          fields: 'files(id, name)',
        })
      } else {
        console.error('Error getting files:', error)
        throw new Error('No tokens found for the given user.')
      }
    }
  } catch (error) {
    console.error('Error getting files:', error)
    throw new Error('No tokens found for the given user.')
  }

  const files = filesResponse.data.files

  if (!files || files.length === 0) return null

  return files
}

export async function getDrive(credentials, userId = null) {
  if (!credentials) {
    credentials = await getUser(userId)
  }

  try {
    googleAuth.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    })

    return google.drive({ version: 'v3', auth: googleAuth })
  } catch (error) {
    console.error('Error getting drive:', error)
    throw new Error('No tokens found for the given user.')
  }
}

googleAuth.on('tokens', tokens => {
  if (tokens.refresh_token) {
    // store the refresh_token in your secure persistent database
    //console.log('refresh_token', tokens)
  }
  //console.log('access_token', tokens)
})

export async function createFile(userId, fileName, text) {
  // Fetch user's tokens from Firestore
  const userRef = db.collection('users').doc(userId)
  const userSnapshot = await userRef.get()

  if (!userSnapshot.exists)
    throw new Error('No tokens found for the given user.')

  const tokens = userSnapshot.data()

  const drive = await getDrive(tokens)

  let folderId = await getFolderId(userId, drive)

  // Create a new file in the folder
  const fileResponse = drive.files.create({
    media: {
      mimeType: 'text/plain',
      body: text,
    },
    requestBody: {
      name: fileName,
      fields: 'id',

      parents: [folderId],
    },
  })

  if (!fileResponse || !fileResponse.data || !fileResponse.data.id)
    throw new Error(
      `File could not be created. Error: ${fileResponse}, userId: ${userId}, fileName: ${fileName}, text: ${text}`
    )

  const fileId = fileResponse.data.id

  // Add the file to the folder
  await drive.files.update({
    fileId,
    addParents: folderId,
    removeParents: null,
    fields: 'id, parents',
  })

  return fileName
}

export async function getUserId(email) {
  // This is a conceptual example. Replace with your actual backend setup.
  const clerkSecretKey = process.env.CLERK_SECRET_KEY // Make sure to store this securely!

  try {
    const response = await fetch(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(
        email
      )}`,
      {
        headers: {
          Authorization: `Bearer ${clerkSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Clerk API error: ${response.status} - ${errorData.errors[0].message}`
      )
    }

    const data = await response.json()

    if (data.length > 0) {
      // Assuming email addresses are unique, the first user in the list is the one.
      return data[0].id
    } else {
      return null // User not found with that email
    }
  } catch (error) {
    console.error('Error fetching user ID:', error)
    throw error // Re-throw or handle as needed
  }
}
