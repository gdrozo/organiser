export function createStreamingResponse(controller, encoder) {
  const sendMessage = async (message, delay) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    controller.enqueue(encoder.encode(message + '\n'))
  }

  return (async () => {
    await sendMessage('loading', 2000)
    await sendMessage('processing', 2000)
    await sendMessage('final-result: { "message": "Success!" }', 1000)
    controller.close()
  })()
}

export async function streamTextTunnel(f) {
  const STATUS = 'status:'
  const RESPONSE = 'response:'
  const ERROR = 'error:'

  const encoder = new TextEncoder()
  const [stream, controller] = await getReadableStream()

  const sendMessage = message => {
    controller.enqueue(encoder.encode(STATUS + message + '\n'))
  }

  const sendResponse = message => {
    controller.enqueue(encoder.encode(RESPONSE + message + '\n'))
  }

  const sendError = message => {
    controller.enqueue(encoder.encode(ERROR + message + '\n'))
  }

  const close = () => {
    controller.close()
  }

  const tunnel = {
    stream,
    controller,
    close,
    sendMessage,
    sendResponse,
    sendError,
    response: new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    }),
  }

  if (f && typeof f === 'function') f(tunnel)

  return tunnel
}

async function getReadableStream() {
  return new Promise(async (resolve, reject) => {
    let stream
    const controller = await new Promise((resolve, reject) => {
      stream = new ReadableStream({
        start(controller) {
          resolve(controller)
        },
      })
    })
    console.log('stream', stream)
    resolve([stream, controller])
  })
}
