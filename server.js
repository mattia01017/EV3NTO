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
const mainControllers = require('./controllers/mainControllers')

// routers
const profileRoutes = require('./routes/profileRoutes')
const authRoutes = require('./routes/authRoutes')
const apiRoutes = require('./routes/apiRoutes')
app.use('/profilo', profileRoutes)
app.use('/account', authRoutes)
app.use('/api', apiRoutes)

// home
app.get('/',
    mainControllers.loadHome
)

// ricerca
app.get('/search', mainControllers.search)

// pagina inesistente
app.all('*', (req, res) => {
    console.log(req.url)
    res.status(404).render('404.ejs', { user: req.session.user })
})

app.listen(process.env.PORT)