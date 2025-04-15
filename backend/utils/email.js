
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { incidentUpdateNotification } = require('./emailTemplate');



const sendincidentReportEmail = async (recipientEmail,title,description,location,newStatus,updaterRole,fromEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }

        })
// title, description, location, latitude, longitude, newStatus, updaterRole, fromEmail
        const emailcontent =incidentUpdateNotification(title,description,location,newStatus,updaterRole,fromEmail);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: 'Email Verification',
            html: emailcontent
        })

        console.log("Verification email has been sent");

    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}


const sendincidentResourceEmail = async (recipientEmail,resource) => {

    const templatePath = path.join(__dirname, 'resorceemailtemp.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');
    emailTemplate = emailTemplate
    .replace('{{resourceName}}', resource.name)
    .replace('{{resourceType}}', resource.type)
    .replace('{{resourceLocation}}', resource.location)
    .replace('{{resourceStatus}}', resource.maintenanceStatus)
    .replace('{{adminPanelLink}}', process.env.ADMIN_PANEL_LINK || '#')
    .replace('{{map}}',`https://www.google.com/maps/search/?api=1&query=${resource.location}`);
    //


    console.log(emailTemplate);
    

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }

        })
// title, description, location, latitude, longitude, newStatus, updaterRole, fromEmail
       

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: 'New Resource Added!',
            html: emailTemplate
        })

        console.log("Verification email has been sent");

    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}






module.exports = {
  
    sendincidentReportEmail,sendincidentResourceEmail
}