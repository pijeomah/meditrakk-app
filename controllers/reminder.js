const nodemailer = require('nodemailer');
const cron = require('node-cron')
const Pill = require('../models/Pills')
require("dotenv").config({path: "./config/.env"});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
  },
});

//console.log(transporter)

async function sendReminderEmail(email, pillName) {
  try {
    const mailOptions = {
      from: 'ijeomahpromise@gmail.com',
      to: email,
      subject: 'Pill Alert',
      text: `Hello! This is a reminder to take your ${pillName} pill now.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
    throw error; 
  }
}

const sendEmailReminder = async (req, res) => {
  try {
    const email = req.user.email; // Assuming user is authenticated with Passport.js
    const userPills = await Pill.find({ email: req.user.email });

    userPills.forEach(async (pill) => {
      const { name, frequency, number } = pill;

      if (number === 0) {
        try {
          const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: 'Pill Alert - Pill Finished',
            text: `Hello! This is a reminder that ${name} has finished.`,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        } catch (err) {
          console.error(err);
        }
      }

      if (frequency === 1) {
        // Schedule one reminder at 8 AM
        cron.schedule('0 8 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            console.log('Reminder email sent successfully');
          } catch (err) {
            console.error('Trouble scheduling and sending email', err);
          }
        });
      } else if (frequency === 2) {
        // Schedule two reminders, at 8 AM and 2 PM
        cron.schedule('0 8,14 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            console.log('Reminder email sent successfully');
          } catch (err) {
            console.error('Trouble scheduling and sending email', err);
          }
        });

        cron.schedule('0 14 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            console.log('Second reminder email sent.');
          } catch (error) {
            console.error('Error scheduling and sending second email:', error);
          }
        });
      } else if (frequency >= 3) {
        // Schedule three reminders, at 8 AM, 2 PM, and 8 PM
        cron.schedule('0 8,14,20 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            console.log('Reminder email sent successfully');
          } catch (err) {
            console.error('Trouble scheduling and sending email', err);
          }
        });

        cron.schedule('0 14,20 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            console.log('Second reminder email sent.');
          } catch (error) {
            console.error('Error scheduling and sending second email:', error);
          }
        });

        cron.schedule('0 20 * * *', async () => {
          try {
            await sendReminderEmail(email, name);
            console.log('Third reminder email sent.');
          } catch (error) {
            console.error('Error scheduling and sending third email:', error);
          }
        });
      }
    });

    res.status(200).send('Reminder emails scheduled successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
};

module.exports = { sendEmailReminder, sendReminderEmail };
