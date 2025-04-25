// generateEmiPaymentEmailTemplates.js

const nodemailer = require('nodemailer');

/**
 * Generates HTML for an EMI payment confirmation email.
 * @param {{ name: string }} user
 * @param {{ _id: string, month: number, dueDate: Date, amount: number }} emi
 * @param {{ _id: string }} loan
 * @returns {string}
 */
function generateEmiPaidEmail({ user, emi, loan }) {
  const paidDate = new Date().toLocaleDateString();
  const year = new Date().getFullYear();

  return `
    <html><body style="font-family:Arial,sans-serif;margin:0;padding:0">
      <div style="max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
        <div style="background:#0f62fe;padding:20px;color:#fff;text-align:center">
          <h2>EMI Payment Received</h2>
        </div>
        <div style="padding:20px;line-height:1.6;color:#333">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We have successfully received your EMI payment.</p>
          <ul>
            <li><strong>Loan ID:</strong> ${loan._id}</li>
            <li><strong>EMI No.:</strong> ${emi.month}</li>
            <li><strong>Amount Paid:</strong> ₹${emi.amount}</li>
            <li><strong>Payment Date:</strong> ${paidDate}</li>
            <li><strong>Next Due Date:</strong> ${new Date(emi.dueDate).toLocaleDateString()}</li>
          </ul>
          <p>Thank you for staying on track with your payments.</p>
        </div>
        <div style="background:#f2f2f2;padding:15px;text-align:center;font-size:12px;color:#555">
          &copy; ${year} Your Company. All rights reserved.
        </div>
      </div>
    </body></html>
  `;
}

/**
 * Sends an EMI payment confirmation email.
 * @param {string} recipientEmail
 * @param {{ name: string }} user
 * @param {{ _id: string, month: number, dueDate: Date, amount: number }} emi
 * @param {{ _id: string }} loan
 */
async function sendEmiPaidEmail(recipientEmail, user, emi, loan) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const html = generateEmiPaidEmail({ user, emi, loan });

    await transporter.sendMail({
      from: `"Loan App Team" <${process.env.EMAIL}>`,
      to: recipientEmail,
      subject: 'Your EMI Payment Confirmation',
      html,
    });

    console.log(`✅ EMI payment email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('❌ Error sending EMI payment email:', error);
  }
}

module.exports = { generateEmiPaidEmail, sendEmiPaidEmail };

// Usage in your payemi controller (after updating status to Paid):
// const { sendEmiPaidEmail } = require('./generateEmiPaymentEmailTemplates');
// const user = await User.findById(loan.userId);
// await sendEmiPaidEmail(user.email, { name: user.user_name }, emi, { _id: loan._id });
