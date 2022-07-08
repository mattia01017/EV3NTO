const { insertEvent } = require("../models/events");

const loadMyPage = (req, res) => {
    res.render('mypage.ejs', {user:req.session.user})
}

const checkIfLogged = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login')
    }
}

const loadMyPartecip = (req,res) => {
    res.render('mypage.ejs', {user:req.session.user})
}

const loadAddEvent = (req,res) => {
    res.render('addevent.ejs', {user:req.session.user})
}

const addEventReq = (req,res) => {
    let {name, date, num, privacy, desc} = req.body;
    privacy = privacy == 'priv'
    num = num == ''? null : num
    insertEvent(name, date, num, privacy, desc, req.file, req.session.email)
    res.redirect('/profilo/miei')
}

const profRedirect = (req,res) => {
    res.redirect('/profilo/miei')
}

module.exports = {
    loadMyPage,
    checkIfLogged,
    loadMyPartecip,
    loadAddEvent,
    addEventReq,
    profRedirect
}