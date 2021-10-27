const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');
const path = require('path');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');



router.use('/css', express.static(path.join('node_modules/bootstrap/dist/css')))
router.use('/js', express.static(path.join('node_modules/bootstrap/dist/js')))



router.get('/login', isAuth.loginUser, clientController.getLogin);
router.post('/login', clientController.postLogin);



router.get('/trainer-list',isAuth.loginUser,  clientController.trainerList);
router.post('/enroll', clientController.postEnroll);



router.get('/mytrainer',isAuth.loginUser,  clientController.mytrainer);
router.get('/trainings/:trainerid',isAuth.loginUser,  clientController.trainings);

router.get('/send-note/:trainerid',isAuth.loginUser,  clientController.sendNote);
router.post('/send-note',  clientController.postSendNote);


router.get('/appointment/:trainerid',isAuth.loginUser,  clientController.appointment);
router.post('/appointment',  clientController.postAppointment);


router.get('/sign-up',isAuth.loginUser, clientController.getSignup);
router.get('/registered',isAuth, clientController.getProfile);




router.get('/manage-account/:clientid',isAuth.loginUser, clientController.manageAccount);

router.get('/account', isAuth.loginUser, clientController.getDashboard);





router.post('/account', [
    body('fname')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter First Name'),
    body('lname')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter Last Name'),
    body('address')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter a valid address.'),
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

],clientController.updateAccount); 







router.post(
    '/registered',
    [
      body('fname')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter First Name'),
    body('lname')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter Last Name'),
    body('address')
        .isString()
        .isLength({ min: 2 })
        .trim()
        .withMessage('Please enter a valid address.'),
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
      
    ],clientController.postRegister);


module.exports = router;