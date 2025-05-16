import { auth } from '@clerk/nextjs/server'
import { checkAuth } from '@/utils/auth'
import { createFile, getDrive, getFile, getFiles, getFolderId } from './db'
import fs from 'fs'

export async function getCategories() {
  const userId = await checkAuth()
  if (!userId) throw new Error('Unauthorized access')

  const files = await getFiles(userId)

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
    if (!userId) throw new Error('Unauthorized access')

    const fileName = await createFile(userId, category, text)
    return fileName
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function addText(category, text) {
  try {
    const userId = await checkAuth()

    if (!userId) throw new Error('Unauthorized access')

    const drive = await getDrive(null, userId)
    let file = await getFile(userId, category, drive)

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
      const parentFolderId = await getFolderId(userId, drive)

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

    const folderId = await getFolderId(userId)

    return (await getFile(userId, category, folderId)).text
  } catch (error) {
    console.error('Error retrieving text of category:', category, '\n', error)
    throw error
  }
}
