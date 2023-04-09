const validateRequest = require('../middlewares/validate-request');
const requireLogin = require('../middlewares/require-login');
const commentControllers = require('../controllers/comment-controller');
const express = require('express');
const router = express.Router();

router.post('/MapWorkShop/users/allcomments',requireLogin,validateRequest,commentControllers.getAllComments);
router.post('/MapWorkShop/users/postcomment/:mapid',requireLogin,validateRequest,commentControllers.postComment);
router.post('/MapWorkShop/users/replycomment/:mapid/:commentid',requireLogin,validateRequest,commentControllers.replyComment);
//router.post('/MapWorkShop/users/upvoteforcomment/:commentid',requireLogin,validateRequest,commentControllers.upvote);
//router.post('/MapWorkShop/users/downvoteforcomm/:commentid',requireLogin,validateRequest,commentControllers.downvote);

module.exports = router;