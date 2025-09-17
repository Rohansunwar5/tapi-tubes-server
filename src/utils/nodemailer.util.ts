import nodemailer from 'nodemailer';
import config from '../config';

export const transporter = nodemailer.createTransport({
  // cPanel SMTP configuration from your manual settings
  host: 'mail.daadis.in',
  port: 465, // SSL port from your cPanel settings
  secure: true, // true for port 465 (SSL)
  
  auth: {
    user: config.DOMAIN_EMAIL_USER, // contact@daadis.in
    pass: config.DOMAIN_EMAIL_PASSWORD, // Password from cPanel
  },
  
  // TLS configuration for cPanel SSL
  tls: {
    rejectUnauthorized: false, // Often needed for shared hosting
    servername: 'mail.daadis.in'
  },
  
  // Connection settings (helpful for shared hosting)
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  
  // Debug options (remove in production)
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
});