const events = require('../models/events')
const fs = require('fs')
const path = require('path')

const sendMyEvents = (req, res) => {
    if (req.session.email) {
        events.selectMyEvents(req.session.email).then((data) => {
            res.json(data)
        })
    } else {
        res.json({ Errore: 'Non hai effettuato l\'accesso' })
    }
}

const sendMyPartecip = (req, res) => {
    if (req.session.email) {
        events.selectMyPartecip(req.session.email).then((data) => {
            res.json(data)
        })
    } else {
        res.json({ Errore: 'Non hai effettuato l\'accesso' })
    }
}

const sendImg = async (req, res) => {
    let { imgpath } = req.params
    let { email } = req.session
    let val = await events.selectImage(imgpath, email)
    console.log(val)
    if (val) {
        fs.readFile(path.join(path.dirname(__dirname), 'uploads', imgpath), (err, data) => {
            if (!err) {
                res.send(data)
            } else {
                res.json({ Errore: 'Immagine insesistente o non hai i permessi richiesti' })
            }
        })
    } else {
        res.json({ Errore: 'Immagine insesistente o non hai i permessi richiesti' })
    }
}

module.exports = {
    sendMyEvents,
    sendMyPartecip,
    sendImg
}