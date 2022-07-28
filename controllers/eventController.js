const events = require('../models/events')

const sendEvent = async (req,res) => {
    res.locals.edit = await events.isOwner(req.params.id, req.session.email)
    res.render('eventdetails.ejs');
}

module.exports = {
    sendEvent
}