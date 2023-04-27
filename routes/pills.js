const express = require('express')
const router = express.Router()
const pillController = require('../controllers/pills')


//pill routes
router.get("/", pillController.getPills)

router.post("/createPill", pillController.createPill)

module.exports = router
