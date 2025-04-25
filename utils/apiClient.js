export async function fetchStream(url, onUpdate, onComplete, onError) {
  try {
    const response = await fetch(url)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)

      if (chunk.includes('loading')) {
        onUpdate('loading')
      } else if (chunk.includes('processing')) {
        onUpdate('processing')
      } else {
        onComplete(chunk)
      }
    }
  } catch (error) {
    console.error('Error fetching stream:', error)
    onError()
  }
}
