import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendResetEmail = async (email: string, resetUrl: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Reset your password</h2>
        <p>
          You requested to reset your password.
        </p>
        <p>
          Click the button below to create a new password:
        </p>
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>
        <p style="margin-top: 20px;">
          This link will expire in 10 minutes.
        </p>
        <p>
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
