const { Router } = require("express");
const eventController = require('../controllers/eventController');

const router = Router();

router.get('/:id',
    eventController.sendEvent
);

module.exports = router;