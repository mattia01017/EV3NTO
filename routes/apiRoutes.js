const { Router } = require('express');
const apiControllers = require('../controllers/apiControllers')

const router = Router()

router.get('/myevents', 
    apiControllers.sendMyEvents
)

router.get('/mypartecip',
    apiControllers.sendMyPartecip
)

router.get('/img/:imgpath',
    apiControllers.sendImg
)



module.exports = router;