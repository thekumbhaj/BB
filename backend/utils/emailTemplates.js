const verificationEmailTemplate = (name, verificationUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Verify Your Email</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bugbaar</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1f2937;">Hello, ${name}!</h2>
      <p style="color: #4b5563; line-height: 1.6;">Thank you for registering with Bugbaar. Please verify your email address to activate your account.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Verify Email</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px;">If you did not create an account, please ignore this email. This link will expire in 24 hours.</p>
    </div>
    <div style="background-color: #f9fafb; padding: 16px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Bugbaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const bugCreatedTemplate = (name, bugTitle, severity) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Bug Submitted</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bugbaar</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1f2937;">Bug Report Received</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hi ${name}, your bug report has been successfully submitted.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 30%;">Title</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; color: #4b5563;">${bugTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Severity</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; color: #4b5563; text-transform: capitalize;">${severity}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Status</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; color: #4b5563;">OPEN</td>
        </tr>
      </table>
      <p style="color: #4b5563; line-height: 1.6;">Our team will review your report and update you on any changes.</p>
    </div>
    <div style="background-color: #f9fafb; padding: 16px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Bugbaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const bugStatusUpdatedTemplate = (name, bugTitle, newStatus) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Bug Status Updated</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bugbaar</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1f2937;">Bug Status Updated</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hi ${name}, the status of your bug report has been updated.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 30%;">Title</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; color: #4b5563;">${bugTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">New Status</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; color: #4b5563;">${newStatus}</td>
        </tr>
      </table>
      <p style="color: #4b5563; line-height: 1.6;">Log in to Bugbaar to view the full details of your report.</p>
    </div>
    <div style="background-color: #f9fafb; padding: 16px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Bugbaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const passwordResetTemplate = (name, resetUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Reset Your Password</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bugbaar</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1f2937;">Password Reset Request</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hi ${name}, we received a request to reset your password. Click the button below to choose a new password.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
    <div style="background-color: #f9fafb; padding: 16px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Bugbaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  verificationEmailTemplate,
  bugCreatedTemplate,
  bugStatusUpdatedTemplate,
  passwordResetTemplate,
};
