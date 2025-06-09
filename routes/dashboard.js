const express = require('express')
const router = express.Router()
const dashController = require('../controllers/dash')
const { ensureAuth } = require('../middleware/auth')
console.log(ensureAuth)
router.get('/', ensureAuth, dashController.renderDashboard)


module.exports = router