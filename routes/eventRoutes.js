const { Router } = require("express");
const eventController = require('../controllers/eventController');

const router = Router();

// scheda dettagli evento
router.get('/',
    eventController.sendEvent
);

module.exports = router;