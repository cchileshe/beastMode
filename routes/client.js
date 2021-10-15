const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.js');
const path = require('path');
const { body } = require('express-validator');

router.use('/css', express.static(path.join('node_modules/bootstrap/dist/css')))
router.use('/js', express.static(path.join('node_modules/bootstrap/dist/js')))





router.get('/sign-up', clientController.getSignup);
router.get('/registered', clientController.getProfile);

router.post(
    '/registered',
    [
      body('fname')
        .isString()
        .isLength({ min: 2 })
        .trim(),
    body('lname')
        .isString()
        .isLength({ min: 2 })
        .trim(),
    body('address')
        .isString()
        .isLength({ min: 2 })
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
    ],
    clientController.postRegister
  );


module.exports = router;