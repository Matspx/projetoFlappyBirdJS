const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url

    if (filePath === './') {
        filePath = './flappy.html'
    }

    const extname = String(path.extname(filePath)).toLowerCase()
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
    }[extname] || 'application/octet-stream'

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'})
            res.end('Erro interno do servidor.')
            return
        }

        res.writeHead(200, {'Content-Type': contentType})
        res.end(content, 'utf-8')
    })
})

const PORT = 3000
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`)
})