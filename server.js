require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const { readFileSync } = require('fs');
const https = require('https');

const app = express();

// cookie sessione
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));

// risorse statiche
app.use(express.static('public'));

// middleware per gestione parametri POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// variabili globali views
app.use((req,res,next) => {
    res.locals = {
        user: req.session.user,
        host: req.headers.host
    };
    next();
});

// controllers
const mainControllers = require('./controllers/mainControllers');

// routers
const myPageRoutes = require('./routes/myPageRoutes');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const eventRoutes = require('./routes/eventRoutes');
const searchRoutes = require('./routes/searchRoutes')
app.use('/profilo', myPageRoutes);
app.use('/account', authRoutes);
app.use('/api', apiRoutes);
app.use('/evento', eventRoutes);
app.use('/ricerca', searchRoutes);

// home
app.get('/',
    mainControllers.deleteOrLogout,
    mainControllers.loadHome
);

// pagina inesistente
app.all('*', mainControllers.loadNotFound);

const server = https.createServer(
    {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT)
    },
    app
);

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});