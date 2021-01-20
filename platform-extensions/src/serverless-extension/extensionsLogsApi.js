const axios = require('axios')
const express = require('express')

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-08-15/logs`
const sendLogsUrl = `${process.env.LOG_API_ENDPOINT}/logs`

const startLogServer = () => {
  const app = express()
  app.use(express.json())

  app.post('/', async (req, res) => {
    try {
      await axios({
        url: sendLogsUrl,
        method: 'POST',
        data: req.body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(`LOG_EVENT_SENT`, JSON.stringify(req.body, null, 2))
    } catch (e) {
      console.error(`LOG_EVENT_SEND_ERROR`, e)
    }
    res.status(201).send({message: 'ok'})
  })

  let cb
  const port = new Promise((resolve) => cb = resolve)
  const server = app.listen(0, () => cb(server.address().port))
  return port
}

const registerLogServer = async (extensionId, port) => {
  const {headers} = await axios({
    url: baseUrl,
    method: 'PUT',
    data: {
      types: [
        'platform',
        'function'
      ],
      buffering: {
        maxItems: 1000,
        maxBytes: 262144,
        timeoutMs: 100
      },
      destination: {
        protocol: 'HTTP',
        URI: `http://sandbox:${port}`
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'Lambda-Extension-Identifier': extensionId
    }
  })
  return headers['lambda-extension-identifier']
}

module.exports = {
  registerLogServer,
  startLogServer
}
