require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const {Client} = require('pg')

const app = express()

// postgreSQL database
global.client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASS,
})
client.connect()

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
app.all('*', (req,res) => {
    res.status(404).render('404.ejs', {user:req.session.user})
})

app.listen(process.env.PORT)