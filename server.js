require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')

const app = express()

// middlewares
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// controllers
const authControllers = require('./controllers/authControllers')
const mainControllers = require('./controllers/mainControllers')

// routers
const profileRoutes = require('./routes/profileRoutes')
app.use(profileRoutes)

// home
app.get('/',
    mainControllers.loadHome
)

// login
app.get('/login',
    authControllers.skipIfLogged,
    authControllers.loadLogin
)

app.post('/login',
    authControllers.authenticate
)

// sign in
app.get('/signin',
    authControllers.skipIfLogged,
    authControllers.loadSignin
)
app.post('/signin',
    authControllers.addUser
)

// ricerca
app.get('/search', mainControllers.search)

// pagina inesistente
app.all('*', (req, res) => {
    res.status(404).render('404.ejs', { user: req.session.user })
})

app.listen(process.env.PORT)