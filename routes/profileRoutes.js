const express = require('express')
const router = express.Router()
const multer = require('multer')
const myPageControllers = require('../controllers/myPageControllers')

const upload = multer({dest : 'uploads/'})

router.get('/profilo', 
    myPageControllers.checkIfLogged,
    myPageControllers.profRedirect
)

router.get('/profilo/miei', 
    myPageControllers.checkIfLogged,
    myPageControllers.loadMyPage
)

router.get('/profilo/partecipazioni', 
    myPageControllers.checkIfLogged,
    myPageControllers.loadMyPartecip
)

router.get('/profilo/aggiungi', 
    myPageControllers.checkIfLogged,
    myPageControllers.loadAddEvent
)

router.post('/profilo/aggiungi', 
    upload.single('image'), 
    myPageControllers.checkIfLogged,
    myPageControllers.addEventReq
)

module.exports = router;