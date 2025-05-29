const express = require('express')
// imports the express package and assigns it to a variable

const router = express.Router()
// impots the inbuilt Router package and assigns it to the router variable

const pillController = require('../controllers/pills')
// imports the pills controller file that contains all functionality for the pills route

const { ensureAuth, ensureGuest } = require('../middleware/auth')
// importing and destructuring middeware providing security to the routes

//pill routes
router.get('/dashboard', pillController.getDashboard)

// route to access the main pills route which authenticates the user and gives them access to all their pills
router.get("/form", ensureAuth, pillController.getForm)
// route to access the form to add users pills to the data base 
router.post("/createPill", ensureAuth, pillController.createPill)
// route to submit pills after authenticating id and filling the form
router.put('/updatePill/:id', pillController.updatePill)
// reduce the number of pills left each time the patient takes their medication
router.get("/view/:id", pillController.viewPillInfo)
// route to view info on a  particular medication
router.delete('/deletePills/:id', pillController.deletePills)
// route to delete pill from current medication being taken
router.get("/editPill/:id", pillController.editPill)
// renders the edit pill page 
router.put('/:id', pillController.upgradePill)
// route to update a pill in cases of mistakes or change in regimen using user id
module.exports = router
// exporting router