const events = require('../models/events')

// carica la pagina di dettagli evento, mostrando i pulsanti di partecipazione
// o gestione evento in base all'utente loggato
const sendEvent = async (req,res) => {
    res.render(
        'eventdetails.ejs',
        {
            edit: await events.isOwner(req.query.id, req.session.email)
        }
    );
}

module.exports = {
    sendEvent
}