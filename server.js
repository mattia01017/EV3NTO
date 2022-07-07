require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const accController = require('./controllers/accountControllers')
const {Client} = require('pg')

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASS,
})

client.connect()

// routers
const profileRoutes = require('./routes/profileRoutes')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))

// home
app.get('/', (req, res) => {
    if (req.query.logout) {
        delete req.session.user
    }
    res.render('index.ejs', {user:req.session.user})
})

// login
app.get('/login', (req, res) => {
    res.render('login.ejs', {user:req.session.user})
})

app.post('/login', accController.login);

// sign in
app.get('/signin', (req, res) => {
    res.render('signin.ejs', {user:req.session.user})
})

// ricerca
app.get('/search', (req,res) => {
    res.render('search.ejs', {user:req.session.user})
})

// profilo
app.use(profileRoutes)

// pagina inesistente
app.all('*', (req,res) => {
    res.status(404).render('404.ejs', {user:req.session.user})
})

app.listen(process.env.PORT)