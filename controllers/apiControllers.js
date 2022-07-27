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
        res.json({ Errore: 'Non hai effettuato l\'accesso' });
    }
}

// invia gli eventi a cui partecipa l'utente della sessione corrente
const sendMyPartecip = (req, res) => {
    if (req.session.email) {
        events.selectMyPartecip(req.session.email).then((data) => {
            res.json(data);
        })
    } else {
        res.json({ Errore: 'Non hai effettuato l\'accesso' });
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

module.exports = {
    sendMyEvents,
    sendMyPartecip,
    sendImg
};  