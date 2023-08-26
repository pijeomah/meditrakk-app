/// utils/email.js

const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: process.env.OAUTH_ACCESS_TOKEN
    }
  });





  async function sendReminderEmail(email, pillName) {
    try {
      let mailOptions = {
        from: 'ijeomahpromise@gmail.com',
        to: email, // Use the provided 'email' parameter
        subject: 'Nodemailer Project',
        text: `Hello! This is a reminder to take your ${pillName} pill now.`
      };
  
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.log("Error sending email:", error);
    }
  }
  
module.exports = { sendReminderEmail };


