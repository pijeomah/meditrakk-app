const express = require('express')
const router = express.Router()
const pillController = require('../controllers/pills')
const { ensureAuth, ensureGuest } = require('../middleware/auth')


//pill routes
router.get("/", ensureAuth, pillController.getPills)
router.get("/add", pillController.addPill)
router.post("/createPill", pillController.createPill)
router.put('/updatePill/:id', pillController.updatePill)
router.get("/:id", pillController.showPillInfo)
router.delete('/deletePills/:id', pillController.deletePills)
router.get("/editPill/:id", pillController.editPill)
 router.put('/:id', pillController.upgradePill)

module.exports = router
