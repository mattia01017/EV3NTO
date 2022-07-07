const express = require('express')
const router = express.Router()
const multer = require('multer')
const accountControllers = require('../controllers/accountControllers')

const upload = multer({dest : 'uploads/'})

router.use(accountControllers.checkIfLogged)

router.get(
    '/profilo', 
    accountControllers.profRedirect
)

router.get(
    '/profilo/miei', 
    accountControllers.loadMyPage
)

router.get(
    '/profilo/partecipazioni', 
    accountControllers.loadMyPartecip
)

router.get(
    '/profilo/aggiungi', 
    accountControllers.loadAddEvent
)

router.post(
    '/profilo/aggiungi', 
    upload.single('image'), 
    accountControllers.addEventReq
)

module.exports = router;