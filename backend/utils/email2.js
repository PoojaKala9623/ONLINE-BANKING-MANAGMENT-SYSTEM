// generateLoanStatusEmailTemplates.js

const nodemailer = require('nodemailer');

/**
 * Generates the email HTML for various loan status actions (Approved, Rejected, Cancelled)
 * @param {{ user: { name: string }, loan: { _id: string, appliedAt: Date, tenure: number, interestRate: number, emi: number, loanAmount: number } }} params
 * @param {'Approved'|'Rejected'|'Cancelled'} action
 * @returns {string} HTML string
 */
function generateLoanStatusEmail({ user, loan }, action) {
  const appliedDate = new Date(loan.appliedAt).toLocaleDateString();
  const year = new Date().getFullYear();

  const header = `
    <div style="background:#0f62fe;padding:20px;border-radius:8px 8px 0 0;color:#fff;text-align:center">
      <h2>Loan Application ${action}</h2>
    </div>
  `;
  const footer = `
    <div style="background:#f2f2f2;padding:15px;border-radius:0 0 8px 8px;text-align:center;font-size:12px;color:#555">
      &copy; ${year} Your Company. All rights reserved.
    </div>
  `;

  if (action === "Approved") {
    return `
      <html><body style="font-family:Arial,sans-serif;margin:0;padding:0">
        <div style="max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
          ${header}
          <div style="padding:20px;line-height:1.6;color:#333">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Good news! Your loan has been <strong>approved</strong> and ₹${loan.loanAmount} has been credited to your account.</p>
            <ul>
              <li><strong>Loan ID:</strong> ${loan._id}</li>
              <li><strong>Applied On:</strong> ${appliedDate}</li>
              <li><strong>Tenure:</strong> ${loan.tenure} months</li>
              <li><strong>Interest Rate:</strong> ${loan.interestRate}%</li>
              <li><strong>Monthly EMI:</strong> ₹${loan.emi}</li>
            </ul>
            <p>You can view your EMI schedule <a href="https://yourdomain.com/user/loan/${loan._id}/schedule">here</a>.</p>
          </div>
          ${footer}
        </div>
      </body></html>
    `;
  }

  if (action === "Rejected") {
    return `
      <html><body style="font-family:Arial,sans-serif;margin:0;padding:0">
        <div style="max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
          ${header}
          <div style="padding:20px;line-height:1.6;color:#333">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>We’re sorry to let you know that your loan application (ID: ${loan._id}) has been <strong>rejected</strong>.</p>
            <p>If you have any questions, feel free to reply to this email or contact support.</p>
          </div>
          ${footer}
        </div>
      </body></html>
    `;
  }

  // Cancelled
  return `
    <html><body style="font-family:Arial,sans-serif;margin:0;padding:0">
      <div style="max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
        ${header}
        <div style="padding:20px;line-height:1.6;color:#333">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your loan application (ID: ${loan._id}) has been <strong>cancelled</strong> as per your request.</p>
          <p>If this was a mistake or you’d like to reapply, please visit your dashboard.</p>
        </div>
        ${footer}
      </div>
    </body></html>
  `;
}

/**
 * Sends a loan status email to the specified recipient.
 * @param {string} recipientEmail  
 * @param {{ name: string, email?: string }} user  
 * @param {{ _id: string, appliedAt: Date, tenure: number, interestRate: number, emi: number, loanAmount: number }} loan  
 * @param {'Approved'|'Rejected'|'Cancelled'} action  
 */
async function sendLoanStatusEmail(recipientEmail, user, loan, action) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const html = generateLoanStatusEmail({ user, loan }, action);

    await transporter.sendMail({
      from: `"Loan App Team" <${process.env.EMAIL}>`,
      to: recipientEmail,
      subject: `Your Loan Application has been ${action}`,
      html,
    });

    console.log(`✅ ${action} email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`❌ Error sending ${action} email:`, error);
  }
}

module.exports = {
  generateLoanStatusEmail,
  sendLoanStatusEmail,
};
