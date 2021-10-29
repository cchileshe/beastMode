const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer');
const path = require('path');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');



router.use('/css', express.static(path.join('node_modules/bootstrap/dist/css')))
router.use('/js', express.static(path.join('node_modules/bootstrap/dist/js')))



router.get('/login', isAuth, trainerController.getLogin);
router.post('/login', trainerController.postLogin);


router.get('/account', isAuth.loginTrainer,trainerController.getDashboard);


router.get('/sign-up',isAuth.loginTrainer, trainerController.getSignup);
router.get('/registered',isAuth, trainerController.getProfile);



router.get('/myclient',isAuth.loginTrainer,  trainerController.myclient);
router.get('/myappointment',isAuth.loginTrainer,  trainerController.myAppointment);
router.get('/mytrainings',isAuth.loginTrainer,  trainerController.mytrainings);

router.get('/appointment/:clientid',isAuth.loginTrainer,  trainerController.specificAppointment);


router.get('/mynote',isAuth.loginTrainer,  trainerController.myNote);
router.get('/note/:clientid',isAuth.loginTrainer,  trainerController.specificNote);



router.get('/manage-account/:trainerid',isAuth.loginTrainer, trainerController.manageAccount);

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

],trainerController.updateAccount); 







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
      
    ],trainerController.postRegister);


module.exports = router;