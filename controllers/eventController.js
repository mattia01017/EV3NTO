const events = require('../models/events')

const sendEvent = async (req,res) => {
    res.render(
        'eventdetails.ejs',
        {
            edit: await events.isOwner(req.params.id, req.session.email)
        }
    );
}

module.exports = {
    sendEvent
}