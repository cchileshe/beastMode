const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');
const path = require('path');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');



router.use('/css', express.static(path.join('node_modules/bootstrap/dist/css')))
router.use('/js', express.static(path.join('node_modules/bootstrap/dist/js')))



router.get('/login', clientController.getLogin);

router.post('/login', clientController.postLogin);

router.get('/account', clientController.getDashboard);


router.get('/sign-up', clientController.getSignup);
router.get('/registered',isAuth, clientController.getProfile);


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
        .withMessage('Please enter a valid email address.'),
    body('password', 'Password has to be valid.')
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
    clientController.postRegister
  );


module.exports = router;