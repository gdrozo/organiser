export async function fetchStream(url, body, onUpdate, onComplete, onError) {
  try {
    // Post
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    async function loop() {
      reader.read().then(result => {
        const { done, value } = result
        if (done) return

        const chunk = decoder.decode(value)

        const STATUS = 'status:'
        const RESPONSE = 'response:'

        if (chunk.startsWith(STATUS)) {
          onUpdate(chunk)
        } else if (chunk.startsWith(RESPONSE)) {
          onComplete(chunk)
          return
        } else {
          onError(chunk)
        }

        setTimeout(loop, 100)
      })
    }
    loop()
  } catch (error) {
    console.error('Error fetching stream:', error)
    onError()
  }
}
