const express = require('express')
// importing express into the main routes
const router = express.Router()
// inmporting the express router into the main routes file
const authController = require('../controllers/auth') 
// importing a file called auth.js from the controllers
const homeController = require('../controllers/home')
// importing a file called home.js from the controllers
const { ensureAuth, ensureGuest } = require('../middleware/auth')
// importing two methods that protect from a file in the middleware folder using destructuring
router.get('/',  homeController.getIndex)
// setting up a route on the home page that gets the index file
router.get('/login',  authController.getLogin)
// setting up a route on the login page that gets the login file
router.post('/login', authController.postLogin)
// setting up a route on the login page that posts the logging in credentials 
router.get('/logout', authController.logout)
// setting up a route on the logout page that logs out of the app
router.get('/signup', authController.getSignup)
// setting up a route that get the signup page
router.post('/signup', authController.postSignup)
// setting up a route that posts the signup creds
module.exports = router
// exports this whole file to wherever it is needed