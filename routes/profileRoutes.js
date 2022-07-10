const { Router } = require('express')
const multer = require('multer')
const myPageControllers = require('../controllers/myPageControllers')

const router = Router()

const upload = multer({ dest: 'uploads/' })

router.use(myPageControllers.checkIfLogged)

router.get('/',
    myPageControllers.profRedirect
)

router.get('/miei',
    myPageControllers.deleteEvent,
    myPageControllers.loadMyPage
)

router.get('/partecipazioni',
    myPageControllers.loadMyPartecip
)

router.get('/aggiungi',
    myPageControllers.loadAddEvent
)

router.post('/aggiungi',
    upload.single('image'),
    myPageControllers.addEventReq,
    myPageControllers.profRedirect
)

module.exports = router;