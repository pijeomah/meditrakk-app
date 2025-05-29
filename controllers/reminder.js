const nodemailer = require('nodemailer');
// importing the node mailer package into this document
const cron = require('node-cron')
// importing a node cron for scheduliong when the drugs should be taken
const Pill = require('../models/Pills')
// importing the pill model to interact with the pill database
require("dotenv").config({path: "./config/.env"});
// importing the dotenv file to use store google credentials as environement variables 

const transporter = nodemailer.createTransport({
  // creating a transport object using nodemailer to send emails
  service: 'gmail',
  // specifying gmail as the email service for sending reminder
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USERNAME,
    // storing the username in an environment variable
    pass: process.env.GMAIL_PASSWORD,
    // storing the users password ina secure environment variable
    clientId: process.env.OAUTH_CLIENTID,
    // key value paire of the client id of the app using google oauth from cloud console allows google identify the app
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    // client secret along with client id used to authorize access using googles api
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    // key value pair for refresh tokens which are long lived credentials that allow the app request new tokens over a long period of time 
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
    // key value pair for shortlived credentials that the app access to send emails to user using gmail
  },
  // the auth object specifies the kind of authentication to be used in order to make our email sending secure
  // clientId,clientSecret snd the two tokens are all part of the secure tokens for storingsensitive info 
});

//console.log(transporter)

async function sendReminderEmail(email, pillName) {
  // asyn function for sending email reminders to the user with tow arguments email and pillNmae 
  try {
    // in this try block an email is sent from the app to the user to taketheir pill using the mailOptions objct
    const mailOptions = {
      from: 'ijeomahpromise@gmail.com',
      to: email,
      subject: 'Pill Alert',
      text: `Hello! This is a reminder to take your ${pillName} pill now.`,
    };
// +
    await transporter.sendMail(mailOptions);
    // the transporter sends the email 
    console.log("Email sent successfully");
    // message logged to the console if email is sent successfully
  } catch (error) {
    console.log("Error sending email:", error);
    // error is caught and logged to the console
    throw error; 
  }
}

const sendEmailReminder = async (req, res) => {
  try {
    const email = req.user.email; // Assuming user is authenticated with Passport.js
    // assign theusers email to the email variable by obtaining it from the request body 
    const userPills = await Pill.find({ email: req.user.email });
    // variable userPillsgoes to the pill model and finds all the pills that matches the authenticated users email
    userPills.forEach(async (pill) => {
      // after finding all the pills that match the users email and assigning it to a variable we use the for each method to loop through each pill found 
      const { name, frequency, number } = pill;
      // object destructuring is used to extract the number, frequency and name of the pill from the pill object 
      if (number === 0) {
        // conditional is created to account for edge cases which in this situation is when the pills are finished 
        // when the pills are finished and alert email is sent to the user that the medication is finished 
        try {
          const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: 'Pill Alert - Pill Finished',
            text: `Hello! This is a reminder that ${name} has finished.`,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
          // the transporter sends the necessary email and and if successful a success message is sent to the console
        } catch (err) {
          console.error(err);
          // all errors are caught
        }
      }
      // Scheduling
      if (frequency === 1) {
        // In a case where the frequency of the drug is once a day a reminder is set at 8am using the cron scheduler 
        cron.schedule('0 8 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            // email is sent to the user reminding them to take thier pills 
            console.log('Reminder email sent successfully');
          } catch (err) {
            console.error('Trouble scheduling and sending email', err);
            //  errors are caught
          }
        });
      } else if (frequency === 2) {
        // when the frequency of dosage is twice a day then the cron scheduler is set up for 8am and 2pm 
        cron.schedule('0 8,14 * * *', async () => {
          try {
            // At those times an email is sent to the user to take their pills
            await sendReminderEmail(email, name);
            console.log('Reminder email sent successfully');
            // message that the email was sen successfully 
          } catch (err) {
            console.error('Trouble scheduling and sending email', err);
          }
        });

      } else if (frequency >= 3) {
        // Schedule three reminders, at 8 AM, 2 PM, and 8 PM
        cron.schedule('0 8,14,20 * * *', async () => {
          // cron job scheduled for 8am, 2pm , 8pm 
          try {
            await sendReminderEmail(email, name);
            console.log('Reminder email sent successfully');
            // reminder email successfully for each scheduled time 
          } catch (err) {
            console.error('Trouble scheduling and sending email', err);
          }
        });

       
      }
    });

    res.status(200).send('Reminder emails scheduled successfully.')
    //  status message that the email has been sent successfully 
    res.redirect('/pills');
    // redirect to the pills page after each remnder operation has been carried out 
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
};

// this controller needs a more persistent scheduling system as the cron scheduler is limited in that it is affected by the start and stop of the where the website is hosted 

module.exports = { sendEmailReminder, sendReminderEmail };
