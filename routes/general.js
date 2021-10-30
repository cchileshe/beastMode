const express = require('express');
const router = express.Router();
const adminController = require('../controllers/general');
const { body } = require('express-validator');



router.get('/', adminController.getIndex);


router.get('/find-trainer', adminController.findTrainer);

router.post('/logout', adminController.postLogout);

router.get('/contact-us', adminController.getContact);


router.post('/send', [
    body('email')
        .isEmail()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter Correct Email'),
    body('subject')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please add your subject'),
    body('message')
        .isString()
        .isLength({ min: 20 })
        .trim()
        .withMessage('Please tell us your concern')
      ],adminController.postContact);
  


module.exports = router;