import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
})

export const sendResetEmail = async (to: string, resetLink: string, resetCode: string) => {
  await transporter.sendMail({
    from: `"Horus Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your password',
    html: `
      <h2>Reset Your Password</h2>
      <p>click the link below or use the code:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Or enter this code manually: <strong>${resetCode}</strong></p>
      <p>this link will expire in 1 hour.</p>
    `
  })
}