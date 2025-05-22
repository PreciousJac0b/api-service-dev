import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: process.env.TRANSPORTER_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const testMailer = () => {
  console.log("Testing gmail transporter with config:");
  console.log({
    user: process.env.SMTP_USER,
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Mail transporter setup error:', error);
    } else {
      console.log('Mail transporter is ready to send emails');
    }
  });
};



export { transporter, testMailer };