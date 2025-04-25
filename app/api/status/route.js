import { streamTextTunnel } from '@/utils/streamHelper'

export async function GET() {
  const tunnel = await streamTextTunnel()

  ;(async () => {
    tunnel.sendMessage('loading')
    await awaitToRun(() => tunnel.sendMessage('processing'), 2000)
    await awaitToRun(() => tunnel.sendMessage('final-result'), 1000)

    tunnel.close()
  })()
  return tunnel.response
}

async function awaitToRun(fn, delay) {
  await new Promise(resolve => setTimeout(resolve, delay))
  fn()
}
