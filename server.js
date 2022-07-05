const express = require('express')
const path = require('path')
const ejs = require('ejs')
const fs =  require('fs')

const app = express()

app.use(express.static('public'))
let head = fs.readFileSync('public/head.html', 'utf8')
publicpath = {root: path.join(__dirname, 'public')}

// home
app.get('/', (req, res) => {
    ejs.renderFile('public/index.ejs', {head:head}, (err, str) => {
        res.send(str)
    })
})

// login
app.get('/login', (req, res) => {
    ejs.renderFile('public/login.ejs', {head:head}, (err, str) => {
        res.send(str)
    })
})

// pagina inesistente
app.all('*', (req,res) => {
    res.send("<h1>Errore 404</h1><p>Pagina inesistente</p>")
})


app.listen(3000)