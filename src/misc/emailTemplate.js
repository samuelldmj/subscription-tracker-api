import dayjs from "dayjs";


export const generateEmailTemplate = ({ userName, subscriptionName, renewalDate, reminderLabel, reminderType, customerTimezone }) => {
    const isPreRenewal = reminderType === "pre-renewal";
    const subject = isPreRenewal
        ? `Reminder: Your ${subscriptionName} Subscription Renews Soon`
        : `Urgent: Renew Your ${subscriptionName} Subscription`;
    const heading = isPreRenewal
        ? `Your ${subscriptionName} Subscription is Due Soon`
        : `Your ${subscriptionName} Subscription is Past Due`;
    const message = isPreRenewal
        ? `Your subscription is set to renew on ${dayjs(renewalDate).tz(customerTimezone).format("MMMM D, YYYY")}. Please ensure your payment method is up to date.`
        : `Your subscription is in the grace period and will expire soon unless renewed. Act now to continue enjoying ${subscriptionName}.`;
    const ctaText = isPreRenewal ? "Review Subscription" : "Renew Now";
    const ctaUrl = "https://your-app.com/subscriptions"; // Replace with your app's subscription page URL

    return {
        subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td style="background-color: #007bff; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${heading}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                                Dear ${userName},
                            </p>
                            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                                ${message}
                            </p>
                            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                                <strong>Subscription:</strong> ${subscriptionName}<br>
                                <strong>Renewal Date:</strong> ${dayjs(renewalDate).tz(customerTimezone).format("MMMM D, YYYY")}<br>
                                <strong>Reminder:</strong> ${reminderLabel}
                            </p>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${ctaUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">${ctaText}</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #333333; font-size: 14px; line-height: 1.5; margin: 20px 0 0;">
                                If you have any questions, contact us at <a href="mailto:support@your-app.com" style="color: #007bff; text-decoration: none;">support@your-app.com</a>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f4f4f4; padding: 10px; text-align: center;">
                            <p style="color: #666666; font-size: 12px; margin: 0;">
                                &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.<br>
                                <a href="https://your-app.com/unsubscribe" style="color: #666666; text-decoration: none;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };
};

