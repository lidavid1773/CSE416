const validateRequest = require('../middlewares/validate-request');
const verifyJWToken = require('../middlewares/verify-JWToken');
const userControllers = require('../controllers/user-controller');
const express = require('express');
const router = express.Router();

router.post('/MapWorkShop/users/signin',validateRequest,userControllers.signin);
router.post('/MapWorkShop/users/signup',validateRequest,userControllers.signup);
router.post('/MapWorkShop/users/signout',validateRequest,userControllers.signout);
router.post('/MapWorkShop/users/forgetpass',validateRequest,userControllers.forgetPass);
router.post('/MapWorkShop/users/resetpass/:id/:token',validateRequest,userControllers.resetPass);
router.get('/MapWorkShop/users/getme', verifyJWToken,userControllers.getme);
router.delete('/MapWorkShop/users/deleteuser',validateRequest,userControllers.deleteUser);


module.exports = router;