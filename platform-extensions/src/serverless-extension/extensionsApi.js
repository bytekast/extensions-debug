const axios = require('axios')
const {basename} = require('path')

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`

const register = async () => {
  const {headers} = await axios({
    url: `${baseUrl}/register`,
    method: 'POST',
    data: {
      events: [
        'INVOKE',
        'SHUTDOWN'
      ]
    },
    headers: {
      'Content-Type': 'application/json',
      'Lambda-Extension-Name': basename(__dirname)
    }
  })
  return headers['lambda-extension-identifier']
}

const next = async (extensionId) => {
  const {data} = await axios.get(`${baseUrl}/event/next`, {
    headers: {
      'Content-Type': 'application/json',
      'Lambda-Extension-Identifier': extensionId
    }
  })
  return data
}

module.exports = {
  register,
  next
}
