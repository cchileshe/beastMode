const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer');
const path = require('path');
const { body } = require('express-validator');





router.use('/css', express.static(path.join('node_modules/bootstrap/dist/css')))
router.use('/js', express.static(path.join('node_modules/bootstrap/dist/js')))


router.get('/sign-up', trainerController.getSignup);
router.get('/registered', trainerController.getProfile);

router.post(
    '/registered',
    [
      body('fname')
        .isString()
        .isLength({ min: 2 })
        .withMessage('Enter your First Name')
        .trim(),
    body('lname')
        .isString()
        .isLength({ min: 2 })
        .withMessage('Enter your Last Name')
        .trim(),
    body('address')
        .isString()
        .isLength({ min: 2 })
        .withMessage('Enter your Address')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
   body('password',
            'Please enter a password with only numbers and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
   body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords Did not Match');
        }
        return true;
      })

    ],
    trainerController.postRegister
  );


module.exports = router;