const nodemailer = require("nodemailer");
const emailVerificationTemplate = require("../templates/emailVerification.template");

const sendEmail = async ({ to, subject, text, code }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"Egwinch" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: emailVerificationTemplate(code),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
