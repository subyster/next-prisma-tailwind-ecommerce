require('dotenv').config()
const nodemailer = require('nodemailer')

async function testMail() {
   const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SMTP_SERVICE,
      // host: 'smtp.gmail.com',
      // port: 587,
      // secure: false,
      auth: {
         user: process.env.MAIL_SMTP_USER,
         pass: process.env.MAIL_SMTP_PASS,
      },
   })

   try {
      const info = await transporter.sendMail({
         from: `"Test" <${process.env.MAIL_SMTP_USER}>`,
         to: 'arthur.amaral1@gmail.com',
         subject: 'Test Email',
         text: 'This is a test email sent directly with nodemailer.',
      })

      console.log('✅ Message sent:', info.messageId)
   } catch (err) {
      console.error('❌ Error sending email:', err)
   }
}

testMail()
