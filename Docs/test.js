/**
 * Adds an object to a Firestore document with a given key, generating an auto-ID for the object within the "chats" collection.
 *
 * @param {object} obj The object to add to the document.
 * @param {string} key The key of the document to add the object to.
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 * @returns {Promise<string>} The auto-generated ID of the added object.
 */
async function addObjectToChat(obj, key, db) {
  try {
    const docRef = db.collection('chats').doc(key)
    const collectionRef = docRef.collection('history') // Using a subcollection for auto-generated IDs
    const res = await collectionRef.add(obj)
    console.log('Added document with ID: ', res.id)
    return res.id
  } catch (e) {
    console.error('Error adding document: ', e)
    throw e
  }
}
