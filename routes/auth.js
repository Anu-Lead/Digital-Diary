const express = require('express');
const passport = require('passport')
const router = express.Router()

// This is to Authenticate with Google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc Google Auth Callback
// @route GET /auth/google/callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {
    res.redirect('/dashboard')
}
)

// Logout User
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router