const bodyParser = require('body-parser')
const express = require('express')
const multer = require('multer')

const upload = multer({dest : 'uploads/'})
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// home
app.get('/', (req, res) => {
   res.render('index.ejs')
})

// login
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// sign in
app.get('/signin', (req, res) => {
    res.render('signin.ejs')
})


// pagine dell'account
app.get('/profilo', (req,res) => {
    res.redirect('profilo/miei')
})

app.get('/profilo/miei', (req,res) => {
    res.render('mypage.ejs')
})

app.get('/profilo/partecipazioni', (req,res) => {
    res.render('mypage.ejs')
})

app.get('/profilo/aggiungi', (req,res) => {
    res.render('addevent.ejs')
})

app.post('/profilo/aggiungi', upload.single('image'), (req,res) => {
    console.log(req.body)
    res.redirect('/profilo/miei')
})

// ricerca
app.get('/search', (req,res) => {
    res.render('search.ejs')
})


// pagina inesistente
app.all('*', (req,res) => {
    res.sendStatus(404)
})

app.listen(3000)