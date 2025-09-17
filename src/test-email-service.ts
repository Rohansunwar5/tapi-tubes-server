// test-email-service.ts
import mailService from './services/mail.service';
import { transporter } from './utils/nodemailer.util';

async function testEmailService() {
  console.log('🔧 Testing Email Service Configuration...\n');

  try {
    // Step 1: Test SMTP Connection
    console.log('1. Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Step 2: Test Basic Email (without template)
    console.log('2. Testing basic email sending...');
    const basicEmailResult = await transporter.sendMail({
      from: '"Daadis Team" <contact@daadis.in>',
      to: 'your-test-email@gmail.com', // Replace with your email
      subject: 'Test Email from Daadis - Basic',
      text: 'This is a basic test email to verify SMTP configuration.',
      html: '<p>This is a <b>basic test email</b> to verify SMTP configuration.</p>'
    });
    console.log('✅ Basic email sent successfully!');
    console.log('📧 Message ID:', basicEmailResult.messageId, '\n');

    // Step 3: Test Email Service with Template (if you have a template)
    console.log('3. Testing email service with template...');
    
    // Create a simple test template if you don't have one
    const testTemplateData = {
      name: 'Test User',
      message: 'This is a test email using the email service',
      timestamp: new Date().toISOString()
    };

    // This will only work if you have a template file
    // You might need to create a simple test template first
    try {
      const serviceResult = await mailService.sendEmail(
        'your-test-email@gmail.com', 
        'test-template.ejs', 
        testTemplateData,
        'Test Email from Daadis - Service'
      );
      console.log('✅ Email service test successful!');
      console.log('📧 Message ID:', serviceResult.messageId);
    } catch (templateError) {
      console.log('⚠️  Template test skipped - template file not found');
      console.log('   This is normal if you haven\'t created test-template.ejs yet');
    }

  } catch (error:any) {
    console.error('❌ Email service test failed:');
    console.error(error);
    
    // Troubleshooting suggestions
    console.log('\n🔍 Troubleshooting suggestions:');
    
    if (error.code === 'EAUTH') {
      console.log('- Check DOMAIN_EMAIL_USER and DOMAIN_EMAIL_PASSWORD');
      console.log('- Verify the password in cPanel');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.log('- Try switching to port 587 with TLS instead of port 465 with SSL');
      console.log('- Check if your hosting provider blocks certain ports');
    } else if (error.code === 'ESOCKET') {
      console.log('- Try the alternative configuration (port 587)');
    }
  }
}

// Run the test
testEmailService();

// Export for use in other files
export default testEmailService;