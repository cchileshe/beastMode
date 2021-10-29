const express = require('express');
const router = express.Router();
const adminController = require('../controllers/general');




router.get('/', adminController.getIndex);


router.get('/find-trainer', adminController.findTrainer);

router.post('/logout', adminController.postLogout);


module.exports = router;