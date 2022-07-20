/* Controller delle pagine del profilo */

const NodeGeocoder = require("node-geocoder");
const sharp = require("sharp");
const events = require("../models/events");
const fs = require('fs');
const path = require("path");

// oggetto per il geocoding
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

// invia la pagina degli eventi appartenenti all'utente
const loadMyPage = (req, res) => {
    res.render('mypage.ejs', {
        select: 'i',
        edit: true
    });
}

// middleware per ridirezionare verso la pagina di login se
// non è stato fatto il login
const checkIfLogged = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/account/login');
    }
}

// invia la pagina degli eventi a cui partecipa l'utente
const loadMyPartecip = (req, res) => {
    res.render('mypage.ejs', {
        select: 'e',
        edit: false
    });
}

// invia la pagina di inserimento eventi
const loadAddEvent = (req, res) => {
    res.render('addevent.ejs', {
        select: 'n'
    });
}

// redireziona verso la pagina del profilo
const profRedirect = (req, res) => {
    res.redirect('/profilo/miei');
}

// gestisce la richiesta di aggiunta evento
const addEventReq = async (req, res, next) => {
    let { name, date, num, privacy, desc, location } = req.body;
    privacy = (privacy == 'priv');
    num = (num == '' ? null : num);

    let vals = await geocoder.geocode({ q: location });
    let { latitude, longitude } = vals[0];

    let filename;
    if (req.file) {
        let { buffer, originalname } = req.file;
        filename = originalname + new Date().getTime() + '.webp';
        let filePath = path.join(path.dirname(__dirname) + '/uploads', filename);
        fs.closeSync(fs.openSync(filePath, 'w'));

        // metodo per la compressione dell'immagine inviata dall'utente
        await sharp(buffer)
            .webp({ quality: 50 })
            .toFile(filePath);
    } else {
        filename = 'qm.jpg';
    }

    await events.insertEvent(name, date, num, privacy, desc, filename, req.session.email, location, latitude, longitude);
    next();
}

const deleteEvent = async (req, res, next) => {
    if (req.query.delete) {
        events.deleteMyEvent(req.query.delete, req.session.email);
    }
    next();
}

module.exports = {
    loadMyPage,
    checkIfLogged,
    loadMyPartecip,
    loadAddEvent,
    addEventReq,
    profRedirect,
    deleteEvent
};