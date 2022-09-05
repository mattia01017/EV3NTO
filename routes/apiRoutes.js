/* Router per le richieste AJAX lato client */
/* I dati sono inviati in formato JSON */

const { Router } = require('express');
const apiControllers = require('../controllers/apiControllers');

const router = Router();

// eventi creati dall'utente autenticato
router.get('/myevents', 
    apiControllers.sendMyEvents
);

// eventi a cui partecipa l'utente autenticato
router.get('/mypartecip',
    apiControllers.sendMyPartecip
);

// immagine dell'evento con nome specificato nel path
router.get('/img/:imgpath',
    apiControllers.sendImg
);

// dati sull'evento con id specificato nel path
router.get('/event/:id',
    apiControllers.sendEvent
);

// partecipanti evento specificato nel path
router.get('/event/:id/partecipants',
    apiControllers.sendPartecipants
)

// richiesta di partecipazione
router.post('/event/:id',
    apiControllers.registerPart
);

// ricerca testuale
router.get('/namesearch',
    apiControllers.eventsByName
);

// ricerca nelle vicinanze
router.get('/geosearch',
    apiControllers.eventsByPos
);

module.exports = router;