const NodeGeocoder = require("node-geocoder");
const events = require("../models/events");

const geocoder = NodeGeocoder({ provider: 'openstreetmap' })

const loadMyPage = (req, res) => {
    res.render('mypage.ejs', { 
        user: req.session.user,
        select: 'i',
        edit: true
    })
}

const checkIfLogged = (req, res, next) => {
    if (req.session && req.session.user) {
        next()
    } else {
        res.redirect('/account/login')
    }
}

const loadMyPartecip = (req, res) => {
    res.render('mypage.ejs', { 
        user: req.session.user,
        select: 'e',
        edit: false
    })
}

const loadAddEvent = (req, res) => {
    res.render('addevent.ejs', { 
        user: req.session.user,
        select: 'n'
    })
}

const profRedirect = (req, res) => {
    res.redirect('/profilo/miei')
}


const addEventReq = async (req, res, next) => {
    let { name, date, num, privacy, desc, location } = req.body;
    privacy = privacy == 'priv'
    num = num == '' ? null : num
    
    let vals = await geocoder.geocode({q: location})
    let {latitude,longitude} = vals[0]

    let file_path = req.file ? req.file.path : null
    await events.insertEvent(name, date, num, privacy, desc, file_path, req.session.email, location, latitude, longitude)
    next()
}

const deleteEvent = async (req,res,next) => {
    if (req.query.delete) {
        events.deleteMyEvent(req.query.delete, req.session.email)
    }
    next()
}

module.exports = {
    loadMyPage,
    checkIfLogged,
    loadMyPartecip,
    loadAddEvent,
    addEventReq,
    profRedirect,
    deleteEvent
}