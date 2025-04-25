const nodemailer = require('nodemailer');
const generateLoanEmailTemplates = require('./templates');

const sendUserConfirmEmail = async (recipientEmail, user, loan) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const { userTemplate } = generateLoanEmailTemplates({ user, loan });

    await transporter.sendMail({
      from: `"Loan App Team" <${process.env.EMAIL}>`,
      to: recipientEmail,
      subject: 'Your Loan Application Confirmation',
      html: userTemplate,
    });

    console.log("✅ User confirmation email sent!");
  } catch (error) {
    console.error('❌ Error sending user confirmation email:', error);
  }
};


const sendadminEmail = async (recipientEmail, user, loan) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
  
      const { adminTemplate } = generateLoanEmailTemplates({ user, loan });
  
      await transporter.sendMail({
        from: `"Loan App Team" <${process.env.EMAIL}>`,
        to: recipientEmail,
        subject: 'Your Loan Application Confirmation',
        html: adminTemplate,
      });
  
      console.log("✅ User confirmation email sent!");
    } catch (error) {
      console.error('❌ Error sending user confirmation email:', error);
    }
  };

module.exports ={sendUserConfirmEmail,sendadminEmail} ;
