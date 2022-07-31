const { Router } = require("express");
const eventController = require('../controllers/eventController');

const router = Router();

router.get('/',
    eventController.sendEvent
);

module.exports = router;