const events = require('../models/events')

const sendMyEvents = (req,res) => {
    if (req.session.email) {
        events.selectMyEvents(req.session.email).then((data) => {
            res.json(data) 
        })
    } else {
        res.json({Errore: 'Non hai effettuato l\'accesso'})
    }
}

const sendMyPartecip = (req,res) => {
    if (req.session.email) {
        events.selectMyPartecip(req.session.email).then((data) => {
            res.json(data)
        })
    } else {
        res.json({Errore: 'Non hai effettuato l\'accesso'})
    }
}

module.exports = {
    sendMyEvents,
    sendMyPartecip
}