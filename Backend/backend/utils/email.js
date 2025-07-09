const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // oppure SMTP personalizzato
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const link = `http://localhost:9099/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"BreakMeet" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Conferma la tua email",
    html: `
  <h2>Benvenuto su BreakMeet!</h2>
  <p>Per completare la registrazione, clicca il link qui sotto:</p>
  <a href="${link}" style="color:#007bff">Verifica la tua email</a>
  <p>Se non sei stato tu, ignora questo messaggio.</p>
`,
  });
};

// ✅ Email per reset password
const sendPasswordResetEmail = async (to, token) => {
  const link = `${process.env.CLIENT_BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"BreakMeet" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset della password",
    html: `
        <h2>Hai richiesto un reset password</h2>
        <p>Clicca il link per scegliere una nuova password:</p>
        <a href="${link}">${link}</a>
        <p>Se non sei stato tu, ignora questa email.</p>
      `,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
