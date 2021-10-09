const express = require('express');
const router = express.Router();
const beastController = require('../controllers/beast');





router.get('/', beastController.getIndex);


module.exports = router;