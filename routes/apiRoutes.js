/* Router per le richieste AJAX lato client */

const { Router } = require('express');
const apiControllers = require('../controllers/apiControllers');

const router = Router();

// invia in formato JSON gli eventi creati dall'utente autenticato
router.get('/myevents', 
    apiControllers.sendMyEvents
);

// invia in formato JSON gli eventi a cui partecipa l'utente autenticato
router.get('/mypartecip',
    apiControllers.sendMyPartecip
);

// invia le immagini degli eventi del path specificato
router.get('/img/:imgpath',
    apiControllers.sendImg
);



module.exports = router;