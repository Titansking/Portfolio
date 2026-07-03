import nodemailer from 'nodemailer';

// Loaded from backend/.env
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const receiverEmail = process.env.NOTIFICATION_RECEIVER || 'akumarclash1@gmail.com';

/**
 * Sends an email notification to the portfolio owner when a new contact inquiry is received.
 * Fallback to logging to the console if SMTP details are missing or are placeholder defaults.
 */
export async function sendEmailNotification(name: string, email: string, message: string): Promise<boolean> {
  const isConfigured = 
    emailUser && 
    emailPass && 
    emailUser !== 'your-email@gmail.com' && 
    emailPass !== 'your-gmail-app-password';

  if (!isConfigured) {
    console.log('--------------------------------------------------------------------');
    console.log('📬 [SMTP Notifier] Nodemailer is in local MOCK mode.');
    console.log('👉 To enable active email alerts, configure EMAIL_USER and EMAIL_PASS');
    console.log('   with your Gmail App Password credentials inside backend/.env');
    console.log(`✉️  Notification target: ${receiverEmail}`);
    console.log('--------------------------------------------------------------------');
    return true;
  }

  try {
    // Configure standard SMTP transport (e.g. for Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: `"Ashwani Portfolio Alert" <${emailUser}>`,
      to: receiverEmail,
      subject: `💼 New Contact Lead: ${name}`,
      text: `Hello Ashwani,\n\nYou have received a new contact submission from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nBest regards,\nPortfolio Admin System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 0;">New Inquiry Received!</h2>
          <p style="font-size: 16px; color: #1e293b;">Hello Ashwani,</p>
          <p style="font-size: 15px; color: #475569;">You have received a new contact submission from your portfolio website:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b; width: 100px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #475569;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">Email Address:</td>
              <td style="padding: 8px 0; color: #475569;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; color: #475569; white-space: pre-wrap; line-height: 1.5;">${message}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              This notification was automatically sent by the portfolio backend server.
            </p>
          </div>
        </div>
      `
    };

    console.log(`[SMTP Notifier] 📧 Sending email alert to ${receiverEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP Notifier] ✅ Email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('[SMTP Notifier] ❌ Failed to dispatch email alert:', error);
    // Return true anyway so database save is not blocked, but log error
    return false;
  }
}

/**
 * Sends an email notification to the portfolio owner when someone downloads their resume.
 */
export async function sendResumeDownloadNotification(userAgent: string, ip: string): Promise<boolean> {
  const isConfigured = 
    emailUser && 
    emailPass && 
    emailUser !== 'your-email@gmail.com' && 
    emailPass !== 'your-gmail-app-password';

  if (!isConfigured) {
    console.log('📬 [SMTP Notifier] Nodemailer resume download notification mocked (credentials empty).');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: `"Ashwani Portfolio Alert" <${emailUser}>`,
      to: receiverEmail,
      subject: `📥 Resume Download Alert!`,
      text: `Hello Ashwani,\n\nSomeone has downloaded your resume from your portfolio website.\n\nTime: ${new Date().toLocaleString()}\nIP Address: ${ip}\nUser-Agent: ${userAgent}\n\nBest regards,\nPortfolio Admin System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #047857; border-bottom: 2px solid #047857; padding-bottom: 10px; margin-top: 0;">📥 Resume Downloaded!</h2>
          <p style="font-size: 16px; color: #1e293b;">Hello Ashwani,</p>
          <p style="font-size: 15px; color: #475569;">Someone has just downloaded your resume from your portfolio website. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b; width: 120px;">Download Time:</td>
              <td style="padding: 8px 0; color: #475569;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">IP Address:</td>
              <td style="padding: 8px 0; color: #475569;">${ip}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b; vertical-align: top;">Browser Details:</td>
              <td style="padding: 8px 0; color: #475569; font-size: 13px;">${userAgent}</td>
            </tr>
          </table>

          <div style="background-color: #f0fdf4; border-left: 4px solid #047857; padding: 15px; border-radius: 4px; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #1e293b;">
              Great job! Keep monitoring your inbound leads.
            </p>
          </div>
        </div>
      `
    };

    console.log(`[SMTP Notifier] 📧 Sending resume download email alert to ${receiverEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP Notifier] ✅ Email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('[SMTP Notifier] ❌ Failed to dispatch resume download email alert:', error);
    return false;
  }
}

