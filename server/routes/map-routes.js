const validateRequest = require('../middlewares/validate-request');
const requireLogin = require('../middlewares/require-login');
const mapControllers = require('../controllers/map-congroller');
const express = require('express');
const router = express.Router();

router.get('/MapWorkShop/users/viewMap/:mapid',validateRequest,mapControllers.viewMap);
router.post('/MapWorkShop/users/singleMap/:mapid',validateRequest,mapControllers.getMapById);
router.post('/MapWorkShop/users/newMap',validateRequest,mapControllers.createMap);
router.post('/MapWorkShop/users/searchMaps',validateRequest,mapControllers.searchMaps);
router.post('/MapWorkShop/users/updateMap/:mapid',validateRequest,mapControllers.updateMap);
//router.post('/MapWorkShop/users/upvoteformap/:mapid',requireLogin,validateRequest,mapControllers.upvote);
//router.post('/MapWorkShop/users/downvoteformap/:mapid',requireLogin,validateRequest,mapControllers.downvote);
router.post('/MapWorkShop/users/download/:mapid',requireLogin,validateRequest,mapControllers.downloadMap);


module.exports = router;