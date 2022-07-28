/* Router per le richieste AJAX lato client */

const { Router } = require('express');
const apiControllers = require('../controllers/apiControllers');
const { checkIfLogged } = require('../controllers/myPageControllers');

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

router.get('/event/:id',
    apiControllers.sendEvent
);

router.post('/event/:id',
    apiControllers.registerPart
);



module.exports = router;