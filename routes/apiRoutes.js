const { Router } = require('express');
const apiControllers = require('../controllers/apiControllers')

const router = Router()

router.get('/myevents', apiControllers.fetchMyEvents)

module.exports = router;