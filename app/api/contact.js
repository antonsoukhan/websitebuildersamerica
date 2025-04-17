import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST allowed" });

  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "Missing fields" });

  // configure your SMTP settings in env vars
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New message from ${name}`,
      text: message + `\n\nFrom: ${name} <${email}>`,
      html: `<p>${message}</p><p>From: <strong>${name}</strong> (${email})</p>`,
    });

    res.status(200).json({ message: "Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending email" });
  }
}
