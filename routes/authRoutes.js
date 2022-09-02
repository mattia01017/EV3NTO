/* Router per le pagine di autenticazione e iscrizione */

const { Router } = require("express");
const authControllers = require('../controllers/authControllers');

const router = Router();

// middleware per ridirezionare verso la pagina personale se già loggati
router.use(authControllers.skipIfLogged);

// form di autenticazione
router.get('/login',
    authControllers.loadLogin
);

// riceve credenziali per l'autenticazione
router.post('/login',
    authControllers.authenticate
);

// form di registrazione al sito
router.get('/signin',
    authControllers.loadSignin
);

// riceve le credenziali per la registrazione
router.post('/signin',
    authControllers.addUser
);

module.exports = router;