const express = require('express')
const path = require('path')
// const ejs = require('ejs')
const fs =  require('fs')

const app = express()

app.use(express.static('public'))

// home
app.get('/', (req, res) => {
   res.render('index.ejs')
})

// login
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// pagina dell'account
app.get('/me', (req,res) => {
    res.render('mypage.ejs')
})

// pagina inesistente
app.all('*', (req,res) => {
    res.send("<h1>Errore 404</h1><p>Pagina inesistente</p>")
})


app.listen(3000)