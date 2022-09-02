const { Router } = require("express");
const searchControllers = require('../controllers/searchControllers');

const router = Router();

// lista con risultato ricerca testuale
router.get('/',
    searchControllers.searchByName
);

// lista con eventi nelle vicinanze
router.get('/vicinanze',
    searchControllers.searchNearby
)

module.exports = router;