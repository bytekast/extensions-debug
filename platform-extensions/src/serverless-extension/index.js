#!/usr/bin/env node
const {register, next} = require('./extensionsApi')
const {startLogServer, registerLogServer} = require('./extensionsLogsApi')

const handleShutdown = async (event) => {
  console.log('SHUTDOWN_EVENT', event)
  process.exit(0)
}

const handleInvoke = async (event) => {
  console.log('INVOKE_EVENT', event.requestId)
}

(async function main() {
  process.on('SIGINT', async () => await handleShutdown('SIGINT'))
  process.on('SIGTERM', async () => await handleShutdown('SIGTERM'))

  const extensionId = await register()
  const port = await startLogServer()
  await registerLogServer(extensionId, port)

  while (true) {

    await new Promise(resolve => setTimeout(resolve, 200)) // Forced Delay

    const event = await next(extensionId)
    switch (event.eventType) {
      case 'SHUTDOWN':
        await handleShutdown(event)
        break
      case 'INVOKE':
        await handleInvoke(event)
        break
    }
  }
})()
