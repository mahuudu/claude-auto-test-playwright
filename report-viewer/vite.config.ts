import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-test-results',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/test-results/')) {
            const filePath = path.resolve(__dirname, '..', decodeURIComponent(req.url.slice(1)))
            fs.readFile(filePath, (err, data) => {
              if (err) return next()
              if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png')
              res.end(data)
            })
          } else {
            next()
          }
        })
      }
    }
  ],
  // serve ../reports/ as static files so fetch('/latest.json') works in dev
  publicDir: path.resolve(__dirname, '../reports'),
})
