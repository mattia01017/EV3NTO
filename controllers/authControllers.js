const skipIfLogged = (req,res,next) => {
    if (req.session && req.session.user) {
        res.redirect('/profilo/miei')
    } else {
        next()
    }
}

const authenticate =  (req, res) => {
    let {user, password} = req.body
    let text = 'SELECT email, username FROM users WHERE email=$1 AND (pwd::bytea)=sha256($2)'
    let values = [user, password]
    global.client.query(text, values, (err,vals) => {
        if (err) {
            console.log(err)
        } else {
            if (vals.rows[0]) {
                req.session.email = vals.rows[0].email
                req.session.user = vals.rows[0].username
                req.session.toast = {v: false}
                res.redirect('/profilo/miei')
            } else {
                req.session.toast = {v: true}
                res.redirect('/login')
            }
        }
    })
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
        let text = 'INSERT INTO users VALUES($1,$2,sha256($3))'
        let values = [email, user, password]
        req.session.email = email
        req.session.user = user
        global.client.query(text, values)
        res.redirect('/profilo')
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