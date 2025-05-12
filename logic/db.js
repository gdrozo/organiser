import db from '@/logic/firebaseAdmin'
import { google } from 'googleapis'
import { hasTokenExpired } from '@/utils/auth'

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

export async function getUser(email) {
  try {
    const userRef = db.collection('users').doc(email)
    const userSnapshot = await userRef.get()

    if (!userSnapshot.exists) {
      throw new Error('No tokens found for the given user.')
    }

    return userSnapshot.data()
  } catch (error) {
    throw new Error('No tokens found for the given user.')
  }
}

export async function createUser(email, tokens) {
  const userRef = db.collection('users').doc(email)

  await userRef.set(
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date.toString(),
    },
    { merge: true }
  )
}

async function getFolderIdFromFirebase(email) {
  try {
    const folderRef = db.collection('folders').doc(email)
    const folderSnapshot = await folderRef.get()

    if (!folderSnapshot.exists) return null

    return folderSnapshot.data()
  } catch (error) {
    console.error('Error getting folder:', error)
    throw new Error('No tokens found for the given user.')
  }
}

async function createFolder(email, folderId) {
  const folderRef = db.collection('folders').doc(email)

  await folderRef.set(
    {
      folderId: folderId,
    },
    { merge: true }
  )
}

export async function queryFolderId(email, drive) {
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

    createFolder(email, folderId)

    return folderId
  } catch (error) {
    console.error('Error getting folder:', error)
    throw new Error('No tokens found for the given user.')
  }
}

export async function getFolderId(email, drive) {
  let folderId = await getFolderIdFromFirebase(email)

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

    createFolder(email, folderId)

    return folderId
  } catch (error) {
    console.error('Error getting folder:', error)
    throw new Error('No tokens found for the given user.')
  }
}

export async function getFile(email, fileName, drive) {
  if (!email) throw new Error('User email is required to retrieve tokens.')

  if (!drive) drive = await getDrive(null, email)

  try {
    // Search for the file
    const res = await drive.files.list({
      q: `name='${fileName}'`,
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

export async function getFiles(email) {
  if (!email) throw new Error('User email is required to retrieve tokens.')

  const tokens = await getUser(email)

  // checking tokens
  if (!tokens) {
    console.Error('No tokens found for the given user.')
    throw new Error('Tokens expired')
  }

  const drive = await getDrive(tokens)

  let folderId = await getFolderId(email, drive)
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
        folderId = await queryFolderId(email, drive)
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

export async function getDrive(credentials, email = null) {
  if (!credentials) {
    credentials = await getUser(email)
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
