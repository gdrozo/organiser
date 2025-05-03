/**
 * Checks if the Google Drive tokens have expired.
 *
 * @param {object} tokens An object containing the access token and expiry date.
 * @returns {boolean} True if the tokens have expired, false otherwise.
 */
function checkTokenExpiration(tokens) {
  if (!tokens || !tokens.expiry_date) {
    return true // Assume expired if tokens or expiry_date is missing
  }

  const now = new Date()
  const expiryDate = new Date(tokens.expiry_date)

  return now >= expiryDate
}

export default checkTokenExpiration
