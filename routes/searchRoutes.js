const { Router } = require("express");
const searchControllers = require('../controllers/searchControllers');

const router = Router();

router.get('/',
    searchControllers.searchByName
);

router.get('/vicinanze',
    searchControllers.searchNearby
)

module.exports = router;