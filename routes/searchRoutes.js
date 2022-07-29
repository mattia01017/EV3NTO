const { Router } = require("express");
const searchControllers = require('../controllers/searchControllers');

const router = Router();

router.get('/',
    searchControllers.searchByName
);

module.exports = router;