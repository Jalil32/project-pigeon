import nodemailer from 'nodemailer';
const sendEmail = async (options: any) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Jason Millman <hello@jason.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html
    };

    // 3) Actually send the email
    console.log('sending email: ', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('email sent');
};

export = sendEmail;
