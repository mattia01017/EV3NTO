/* Controller delle richieste AJAX */

const events = require('../models/events');
const path = require('path');

// invia gli eventi appartenenti all'utente della sessione corrente
const sendMyEvents = async (req, res) => {
    if (req.session.email) {
        events.selectMyEvents(req.session.email).then((data) => {
            res.json(data);
        });
    } else {
        res.status(400).json({ Errore: 'Non hai effettuato l\'accesso' });
    }
}

// invia gli eventi a cui partecipa l'utente della sessione corrente
const sendMyPartecip = async (req, res) => {
    if (req.session.email) {
        events.selectMyPartecip(req.session.email).then((data) => {
            res.json(data);
        })
    } else {
        res.status(400).json({ Errore: 'Non hai effettuato l\'accesso' });
    }
}

// invia l'immagine di un evento se esiste
const sendImg = async (req, res) => {
    let { imgpath } = req.params;
    let { email } = req.session;
    if (imgpath != 'null') {
        res.sendFile(path.join(path.dirname(__dirname), 'uploads', imgpath), (err) => {
            if (err) {
                res.json({ Errore: 'Immagine insesistente o eliminata' });
            }
        });
    } else {
        res.sendFile(path.join(path.dirname(__dirname), 'public/assets/images/qm.webp'));
    }
}

// invia l'evento con id specificato tra i parametri GET
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

// registra la partecipazione ricevuta attraverso una richiesta POST
const registerPart = async (req, res) => {
    let { add, remove } = req.body;
    if (add) {
        let err = await events.insertPartecipant(add, req.session.email);
        let n = await events.selectNumPart(add);
        res.send({
            numPart: n,
            error: err
        });
    }
    else if (remove) {
        await events.deletePartecipant(remove, req.session.email);
        let n = await events.selectNumPart(remove);
        res.send({ numPart: n });
    } else {
        res.sendStatus(400);
    }
}

// risponde con gli eventi risultato della ricerca
const eventsByName = async (req, res) => {
    let { q } = req.query;
    if (q && q != '') {
        let rows = await events.selectEventsByName(q);
        res.json(rows);
    } else {
        res.status(400).json({ Errore: 'Stringa di ricerca vuota' });
    }
}

// invia gli eventi nelle vicinanze di un punto, entro un certo raggio, specificati
// tra i parametri GET
const eventsByPos = async (req, res) => {
    let { lat, lon, dist } = req.query;
    if (lat && lon && dist) {
        let rows = await events.selectNearbyEvents(lat, lon, dist);
        res.json(rows);
    } else {
        res.status(400).json({ Errore: 'Specificare parametri "lat", "lon" e "dist"' });
    }
}

// invia i partecipanti dell'evento specificato tra i parametri GET solo se l'utente loggato
// è il proprietario di quest'ultimo
const sendPartecipants = async (req, res) => {
    let { id } = req.params;
    if (events.isOwner(id, req.session.email)) {
        let rows = await events.selectPartecipants(id);
        res.json(rows);
    } else {
        res.status(401).json({ Errore: 'Non possiedi questo evento' });
    }
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