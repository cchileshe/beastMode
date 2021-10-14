const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.js');
const path = require('path');


router.use('/css', express.static(path.join('node_modules/bootstrap/dist/css')))
router.use('/js', express.static(path.join('node_modules/bootstrap/dist/js')))





router.get('/sign-up', clientController.getIndex);


module.exports = router;