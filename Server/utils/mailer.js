import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mukta.practice@gmail.com",      // तुझा gmail
    pass: "aoayxtqxgehjvbxv", // Google app password
  },
});

export const sendResetEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: "mukta.practice@gmail.com",
    to: to,
    subject: "Reset your password",
    html: `
      <h3>Password Reset</h3>
      <p>Click below link to reset password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};
