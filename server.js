const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const accController = require('./controllers/accountControllers')

// routers
const profileRoutes = require('./routes/profileRoutes')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}))

// home
app.get('/', (req, res) => {
   res.render('index.ejs')
})

// login
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', accController.login);

// sign in
app.get('/signin', (req, res) => {
    res.render('signin.ejs')
})

// ricerca
app.get('/search', (req,res) => {
    res.render('search.ejs')
})

// profilo
app.use(profileRoutes)

// pagina inesistente
app.all('*', (req,res) => {
    res.status(404).render('404.ejs')
})

app.listen(3000)