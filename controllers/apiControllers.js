/* Controller delle richieste AJAX */

const events = require('../models/events');
const path = require('path');

// invia gli eventi appartenenti all'utente della sessione corrente
const sendMyEvents = (req, res) => {
    if (req.session.email) {
        events.selectMyEvents(req.session.email).then((data) => {
            res.json(data);
        })
    } else {
        res.status(400).json({ Errore: 'Non hai effettuato l\'accesso' });
    }
}

// invia gli eventi a cui partecipa l'utente della sessione corrente
const sendMyPartecip = (req, res) => {
    if (req.session.email) {
        events.selectMyPartecip(req.session.email).then((data) => {
            res.json(data);
        })
    } else {
        res.status(400).json({ Errore: 'Non hai effettuato l\'accesso' });
    }
}

// invia l'immagine di un evento se i permessi sono sufficienti
const sendImg = async (req, res) => {
    let { imgpath } = req.params;
    let { email } = req.session;
    if (imgpath != 'null') {
        if (await events.selectImage(imgpath, email)) {
            res.sendFile(path.join(path.dirname(__dirname), 'uploads', imgpath));
        } else {
            res.json({ Errore: 'Immagine insesistente o non hai i permessi richiesti' });
        }
    } else {
        res.sendFile(path.join(path.dirname(__dirname), 'public/assets/images/qm.jpg'));
    }
}

const sendEvent = async (req, res) => {
    let { id } = req.params;
    let event = await events.selectEvent(id);
    if (event) {
        event.ispart = await events.isPartecipant(id, req.session.email);
        res.json(event);
    } else {
        res.status(400).json({ Errore: 'L\'evento non esiste o non disponi di permessi sufficienti' })
    }
}

const registerPart = async (req, res) => {
    let { add, remove } = req.body;
    if (add) {
        await events.insertPartecipant(add, req.session.email);
        res.sendStatus(200);
    }
    else if (remove) {
        await events.deletePartecipant(remove, req.session.email);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
}

const eventsByName = async (req, res) => {
    let { q } = req.query;
    if (q && q != '') {
        let rows = await events.selectEventsByName(q);
        res.json(rows);
    } else {
        res.status(400).json({ Errore: 'Stringa di ricerca vuota' });
    }
}

const eventsByPos = async (req, res) => {
    let { lat, lon, dist } = req.query;
    if (lat && lon && dist) {
        let rows = await events.selectNearbyEvents(lat, lon, dist);
        res.json(rows);
    } else {
        res.status(400).json({Errore: 'Specificare parametri "lat", "lon" e "dist"'});
    }
}

const sendPartecipants = async (req,res) => {
    let {id} = req.params;
    let rows = await events.selectPartecipants(id);
    res.json(rows);
}

module.exports = {
    sendMyEvents,
    sendMyPartecip,
    sendImg,
    sendEvent,
    registerPart,
    eventsByName,
    eventsByPos,
    sendPartecipants
};  