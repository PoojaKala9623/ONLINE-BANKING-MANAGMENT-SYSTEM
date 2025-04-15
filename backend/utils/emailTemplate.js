


const incidentUpdateNotification = (incidentTitle, description,location, newStatus, updaterRole, fromEmail) => {
  // console.log("from email",fromEmail,updaterRole,"new status",newStatus,"latitude",latitude,"longitude",longitude,"description",description,"incident title",incidentTitle);
  
    return `
      <h1 style="color: #008080; font-family: 'Arial', sans-serif; text-align: center;">Incident Status Updated</h1>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
        
        <p style="font-size: 16px; font-family: 'Arial', sans-serif; color: #444; text-align: center;">
          The status of your reported incident has been updated.
        </p>
  
        <p><strong>Incident Title:</strong> ${incidentTitle}</p>
        <p><strong>Description:</strong> ${description}</p>
  
        <div style="text-align: center; margin-top: 10px;">
          <a href="https://www.google.com/maps?q=${location}" 
             style="display: inline-block; background-color: #007bff; color: #fff; font-size: 16px; font-family: 'Arial', sans-serif; text-decoration: none; padding: 10px 20px; border-radius: 5px; border: 2px solid #007bff; transition: background-color 0.3s ease-in-out;">
            View Location
          </a>
        </div>
  
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p><strong>Updated By:</strong> ${updaterRole}</p>
        <p><strong>Updated By Email:</strong> ${fromEmail}</p>
  
        <p style="text-align: center; margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL}dashboard" 
             style="display: inline-block; background-color: #008080; color: #fff; font-size: 18px; font-family: 'Arial', sans-serif; text-decoration: none; padding: 10px 20px; border-radius: 5px; border: 2px solid #008080; transition: background-color 0.3s ease-in-out;">
            Go to Dashboard
          </a>
        </p>
  
      </div>
    `;
  };
  


module.exports = {incidentUpdateNotification}