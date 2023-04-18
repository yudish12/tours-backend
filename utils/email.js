const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const emailFunc = async (options) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Yudish <yudishchakrawarty3042@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };

  await transport.sendMail(mailOptions);
};
module.exports = emailFunc;
