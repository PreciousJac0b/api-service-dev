import {transporter} from "../utils/mailer.js";

async function sendMailService(req, res, mailContent) {
  try {
    const info = await transporter.sendMail({
      from: '"Greensol API" <peejae51@gmail.com>',
      to: `${mailContent.mail}`,
      subject: `${mailContent.subject}`,
      // text: `${mailContent.text}`,
      html: `${mailContent.html}`,
    });
    res.status(200).send(`Mail sent to ${mailContent.mail} successfully\n`);
  } catch (err) {
    console.error("Error while sending mail", err);
    res.status(500).send('Failed to send mail');
  }
}

export { sendMailService }