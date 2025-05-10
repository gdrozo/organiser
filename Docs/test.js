const { google } = require('googleapis')
const { authenticate } = require('@google-cloud/local-auth')

async function getFilesByExtension(folderName, fileExtension) {
  try {
    const auth = await authenticate({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      keyfilePath: 'credentials.json', // Ensure this file exists in your working directory
    })

    const drive = google.drive({ version: 'v3', auth })

    // Find the folder ID by name and list files with the specified extension
    let folderId = null
    const fileListResponse = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      fields: 'files(id)',
    })

    const folders = fileListResponse.data.files
    if (folders.length === 0) {
      console.log(`Folder "${folderName}" not found.`)
      return []
    }
    folderId = folders[0].id

    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents and name contains '.${fileExtension}'`,
      fields: 'files(id, name)',
    })

    const files = filesResponse.data.files

    if (files.length === 0) {
      console.log(
        `No files with extension "${fileExtension}" found in folder "${folderName}".`
      )
      return []
    }

    const fileNames = files.map(file => file.name)

    console.log(
      `Files with extension "${fileExtension}" in folder "${folderName}":`
    )
    console.log(fileNames)

    return fileNames
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example usage:
// getFilesByExtension('My Folder', 'pdf');
