// Passenger entrypoint (Hostinger shared hosting) — Passenger sets PORT and
// expects a plain Node script that starts listening; `next start` alone isn't
// invokable that way, so we wrap Next's request handler in a plain http server.
const { createServer } = require("http")
const next = require("next")

const port = parseInt(process.env.PORT, 10) || 3000
const app = next({ dev: false, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Shop ready on port ${port}`)
  })
})
