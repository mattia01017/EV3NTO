const session = require('express-session')

const login = (req, res) => {
    let {user, password} = req.body
    req.session.user = user
    res.redirect('/profilo')
}

const setNameHeader = (req, res) => {
    let {user} = req.session
    res.render('mypage', {user:user})
}

const checkIfLogged = (req, res, next) => {
    if (req.session.user != undefined) {
        next();
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    login,
    setNameHeader,
    checkIfLogged
}