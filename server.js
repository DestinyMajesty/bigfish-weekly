const { createServer } = require('http')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(
    (req, res) => {
      handle(req, res)
    },
  ).listen(8151, (err) => {
    if (err) throw err
    console.info('> Ready on http://localhost:8151')
  })
})
