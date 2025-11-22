import { transporter } from "../config/nodemailer.js";

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: '"Subscription Management api" <samuelldmj5@gmail.com>',
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

export default sendEmail;