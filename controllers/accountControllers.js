const login = (req, res) => {
    let {user, password} = req.body
    req.session.user = user
    res.redirect('/profilo')
}

const loadMyPage = (req, res) => {
    let {user} = req.session
    res.render('mypage.ejs', {user:user})
}

const checkIfLogged = (req, res, next) => {
    if (req.session.user != undefined) {
        next();
    } else {
        res.redirect('/login')
    }
}

const loadMyPartecip = (req,res) => {
    res.render('mypage.ejs', {user:user})
}

const loadAddEvent = (req,res) => {
    res.render('addevent.ejs')
}

const addEventReq = (req,res) => {
    console.log(req.body)
    res.redirect('/profilo/miei')
}

const profRedirect = (req,res) => {
    res.redirect('profilo/miei')
}

module.exports = {
    login,
    loadMyPage,
    checkIfLogged,
    loadMyPartecip,
    loadAddEvent,
    addEventReq,
    profRedirect
}