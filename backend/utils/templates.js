function generateLoanEmailTemplates({ user, loan }) {
    const appliedDate = new Date(loan.appliedAt).toLocaleDateString();
  
    // Confirmation Email to User
    const userTemplate = `
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { background: white; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #0f62fe; color: white; padding: 20px; text-align: center; }
          .details { padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
          .btn { background: #0f62fe; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Loan Application Received</h2>
          </div>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for applying for a <strong>${loan.loanType}</strong>. Here are the details:</p>
          <div class="details">
            <p><strong>Loan Amount:</strong> ₹${loan.loanAmount}</p>
            <p><strong>Tenure:</strong> ${loan.tenure} months</p>
            <p><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
            <p><strong>Monthly EMI:</strong> ₹${loan.emi}</p>
            <p><strong>Status:</strong> ${loan.status}</p>
            <p><strong>Applied On:</strong> ${appliedDate}</p>
          </div>
          <a class="btn" href="https://yourdomain.com/user/loan-status">View Loan Status</a>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  
    // Notification Email to Admin
    const adminTemplate = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #fff; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
          .title { background-color: #333; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
          .details { padding: 20px; background: #fafafa; line-height: 1.5; }
          .highlight { color: #0f62fe; font-weight: bold; }
          .footer { margin-top: 20px; font-size: 12px; color: #aaa; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title"><h3>New Loan Application</h3></div>
          <div class="details">
            <p><strong>User:</strong> ${user.name} (${user.email})</p>
            <p><strong>Loan Type:</strong> ${loan.loanType}</p>
            <p><strong>Loan Amount:</strong> ₹${loan.loanAmount}</p>
            <p><strong>Tenure:</strong> ${loan.tenure} months</p>
            <p><strong>EMI:</strong> ₹${loan.emi}</p>
            <p><strong>Status:</strong> <span class="highlight">${loan.status}</span></p>
            <p><strong>Applied Date:</strong> ${appliedDate}</p>
          </div>
          <div class="footer">
            Loan App System • Notification Service
          </div>
        </div>
      </body>
      </html>
    `;
  
    return { userTemplate, adminTemplate };
  }
  
  module.exports = generateLoanEmailTemplates;
  