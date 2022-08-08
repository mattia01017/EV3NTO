/* Controller delle pagine di autenticazione */

const users = require('../models/users');

// middleware per saltare al profilo personale se già autenticato
const skipIfLogged = async (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/profilo/miei');
    } else {
        next();
    }
}

// controlla email e password per l'autenticazione dal corpo della richiesta. Se corretti 
// risponde con true, altrimenti con false
const authenticate = async (req, res) => {
    let { user, password } = req.body;
    let cred = await users.selectUser(user, password);
    if (cred) {
        req.session.user = cred.username;
        req.session.email = cred.email;
    }
    res.send({ ok: req.session.user ? true : false })
}

// carica la pagina di autenticazione
const loadLogin = async (req, res) => {
    res.render('login.ejs');
}

// carica la pagina di registrazione
const loadSignin = async (req, res) => {
    res.render('signin.ejs', {
        toast: req.session.toast
    });
}

// Registra l'utente al sistema
const addUser = async (req, res) => {
    let { email, user, password } = req.body;
    if (email.includes('@') && password.length >= 3 && user != '') {
        let err = await users.insertUser(email, user, password);
        if (err) {
            res.json({ok: false});
        } else {
            req.session.email = email;
            req.session.user = user;
            res.json({ok: true});
        }
    } else {
        res.status(400).send('Richiesta non valida');
    }
}

module.exports = {
    skipIfLogged,
    authenticate,
    loadLogin,
    loadSignin,
    addUser
};