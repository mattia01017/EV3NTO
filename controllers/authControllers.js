const skipIfLogged = (req,res,next) => {
    if (req.session && req.session.user) {
        res.redirect('/profilo/miei')
    } else {
        next()
    }
}

const authenticate =  (req, res) => {
    let {user, password} = req.body
    req.session.user = user
    res.redirect('/profilo/miei')
}

const loadLogin = (req, res) => {
    res.render('login.ejs', {user:req.session.user})
}

const loadSignin = (req, res) => {
    res.render('signin.ejs', {user:req.session.user})
}

module.exports = {
    skipIfLogged,
    authenticate,
    loadLogin,
    loadSignin
}