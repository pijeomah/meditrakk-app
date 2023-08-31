const express = require('express')
const router = express.Router()
const pillController = require('../controllers/pills')
const { ensureAuth, ensureGuest } = require('../middleware/auth')


//pill routes
router.get("/", ensureAuth, pillController.getPills)
router.get("/form", ensureAuth, pillController.getForm)
router.post("/createPill", ensureAuth, pillController.createPill)
router.put('/updatePill/:id', pillController.updatePill)
router.get("/view/:id", pillController.viewPillInfo)
router.delete('/deletePills/:id', pillController.deletePills)
router.get("/editPill/:id", pillController.editPill)
//router.put('/:id', pillController.upgradePill)

module.exports = router
