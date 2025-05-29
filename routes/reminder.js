const express = require('express')
// importing an instance of express and assigning it to the express variable allowing us to use express methods
const router = express.Router()
// importing inbuilt express router to use router methods
const reminderController = require('../controllers/reminder')
// imports the reminder controller and assigning it to a variable. allows us to use route logic with functions in the reminder controller
const { sendReminderEmail } = require('../controllers/reminder')
// importing the reminder module and useing destructuring to use the sendEmailReminder function(ensures cleaner code)

router.get('/', reminderController.sendEmailReminder)
// route set up for using the email reminder from the reminder controller. route is for getting the page to send the email reminder
router.get('/test-email', async (req, res) => {
  // sets up a test -email endpoint at this GET route
    try {

      const userEmail = 'ijeomahpromise@gmail.com';
      // Hard coded email used to test if the endEmailReminder function works as it ios supposed to
      const pillName = 'Test Pill';
      // Hard coded pill nmae for testing the efficacy of thefunction
      await sendReminderEmail(userEmail, pillName);
      // running the email test asnchronously using the hardcoded variables above
      res.status(200).send('Test email sent successfully.');
      // response sent if the test is successful
    } catch (error) {
      console.error('Error sending test email:', error);
      // errors are logged to th console for debugging 
      res.status(500).send('Error sending test email.');
      // shows the status if the email is unable to be sent
    }
  });


module.exports = router