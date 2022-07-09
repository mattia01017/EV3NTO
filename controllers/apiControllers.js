const events = require('../models/events')

const fetchMyEvents = (req,res,next) => {
    if (req.session.email) {
        events.selectEvents(req.session.email).then((data) => {
            res.json(data) 
        })
    } else {
        res.json({Errore: 'Non hai effettuato l\'accesso'})
    }
}

module.exports = {
    fetchMyEvents
}