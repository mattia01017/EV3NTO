/* Router per le pagine del profilo */

const { Router } = require('express');
const multer = require('multer');
const myPageControllers = require('../controllers/myPageControllers');

const router = Router();

// gestione di immagini in POST
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// redireziona verso la pagina di login se si tenta di accedere alle
// pagine del profilo senza autenticazione
router.use(myPageControllers.checkIfLogged);

// redireziona verso i miei eventi se richiesto '/profilo'
router.get('/',
    myPageControllers.profRedirect
);

// mostra gli eventi dell'utente
router.get('/miei',
    myPageControllers.deleteEvent,
    myPageControllers.loadMyPage
);

// mostra le partecipazioni dell'utente
router.get('/partecipazioni',
    myPageControllers.loadMyPartecip
);

// mostra la pagina per gestire 
router.get('/aggiungi',
    myPageControllers.loadAddEvent
);

// gestisce la richiesta di creazione evento
router.post('/aggiungi',
    upload.single('image'),
    myPageControllers.addEventReq,
    myPageControllers.profRedirect
);

module.exports = router;