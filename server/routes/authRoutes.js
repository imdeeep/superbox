const express = require('express');
const passport = require('passport');
const router = express.Router();
const { authSuccess, authFailure, logout ,checkAuth,getUserByToken} = require('../controllers/authController');
const { isAuthenticated ,isAuthenticatedAndAuthorized} = require('../middlewares/authMiddleware');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL,
    session: true
  }),
    authSuccess
);

router.get('/check', isAuthenticated, checkAuth);
router.get('/failure', authFailure);
router.post('/logout', isAuthenticated,isAuthenticatedAndAuthorized, logout); 
router.post('/user', getUserByToken);

module.exports = router;