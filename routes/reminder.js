const express = require('express')
const router = express.Router()
const reminderController = require('../controllers/reminder')
const { sendReminderEmail } = require('../controllers/reminder')
const { ensureAuth, ensureGuest } = require('../middleware/auth')


router.get('/', reminderController.sendEmailReminder)
router.get('/test-email', async (req, res) => {
    try {
      const userEmail = 'ijeomahpromise@gmail.com'; // Replace with a test email address
      const pillName = 'Test Pill';
  
      await sendReminderEmail(userEmail, pillName);
  
      res.status(200).send('Test email sent successfully.');
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).send('Error sending test email.');
    }
  });


module.exports = router