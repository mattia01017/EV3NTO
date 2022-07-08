const users = require('../models/users')

const skipIfLogged = (req,res,next) => {
    if (req.session && req.session.user) {
        res.redirect('/profilo/miei')
    } else {
        next()
    }
}

const authenticate = async (req, res) => {
    let {user, password} = req.body
    let cred = await users.selectUser(user, password)
    console.log(cred)
    if (cred) {
        req.session.user = cred.username
        req.session.email = cred.email
    }
    if (req.session.user) {
        res.redirect('/profilo/miei')
    } else {
        req.session.toast = {v : true}
        res.redirect('/login')
    }
}

const loadLogin = (req, res) => {
    res.render('login.ejs', {user:req.session.user, toast: req.session.toast})
}

const loadSignin = (req, res) => {
    res.render('signin.ejs', {user:req.session.user})
}

const addUser = (req,res) => {
    let {email, user, password} = req.body
    if (email.includes('@') && password.length >= 3 && user != '') {
        users.insertUser(email,user,password)
        req.session.email = email
        req.session.user = user
        res.redirect('/profilo/miei')
    } else {
        res.status(400).send('Richiesta non valida')
    }
}

module.exports = {
    skipIfLogged,
    authenticate,
    loadLogin,
    loadSignin,
    addUser
}