require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')

const app = express()

// cookie sessione
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))

// risorse statiche
app.use(express.static('public'))

// middleware per gestione parametri POST
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// variabili globali views
app.use((req,res,next) => {
    res.locals = {
        user: req.session.user,
        host: req.headers.host
    }
    next()
})

// controllers
const mainControllers = require('./controllers/mainControllers')

// routers
const myPageRoutes = require('./routes/myPageRoutes')
const authRoutes = require('./routes/authRoutes')
const apiRoutes = require('./routes/apiRoutes')
app.use('/profilo', myPageRoutes)
app.use('/account', authRoutes)
app.use('/api', apiRoutes)

// home
app.get('/',
    mainControllers.loadHome,
)

// ricerca
app.get('/search', mainControllers.search)


// pagina inesistente
app.all('*', (req, res) => {
    console.log(req.url)
    console.log('Request HTTP Version: ', req.httpVersion)
    res.status(404).render('404.ejs')
})

app.listen(process.env.PORT)
