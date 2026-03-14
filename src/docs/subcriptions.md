Subscription Tracker and Payment API
Overview
This Node.js backend application manages subscriptions with flexible payment integration, JWT authentication, and MongoDB storage. The following details the subscription lifecycle, focusing on a non-auto-renewing subscription's grace period and reminder workflow.
Scenario: Non-Auto-Renewing Subscription
User: John Doe (email: john.doe@example.com, timezone: Africa/Lagos, UTC+01:00)Today: May 9, 2025Now: 2025-05-09T11:00:00.000+01:00 (11:00:00 AM Africa/Lagos, UTC: 2025-05-09T10:00:00.000Z)  
Subscription Details

Created: May 9, 2025 via POST /api/v1/subscriptions
Request Body:

{
"name": "Netflix",
"price": 12.99,
"currency": "USD",
"frequency": "weekly",
"category": "entertainment",
"startDate": "2025-05-09",
"paymentMethod": "Credit Card",
"autoRenew": false
}

Key Dates:
Start Date: 2025-05-09T00:00:00.000Z (May 9, 2025, 01:00:00 Africa/Lagos)
Renewal Date: 2025-05-16T00:00:00.000Z (May 16, 2025, 01:00:00 Africa/Lagos)
Grace Period: May 16, 2025 to May 23, 2025 (7 days)
Grace Period End: 2025-05-23T00:00:00.000+01:00 (UTC: 2025-05-22T23:00:00.000Z)

Grace-Period Workflow
Since autoRenew: false, the subscription does not renew automatically on May 16, 2025. It enters a 7-day grace period, during which reminders prompt manual renewal. If not renewed by May 23, the subscription expires on May 24, 2025.

1. Initial Reminder Scheduling (May 9, 2025)

Context: Subscription created at 2025-05-09T11:00:00.000+01:00
Logic: Pre-renewal reminders scheduled for 5, 2, and 1 day(s) before renewal (May 16)
Scheduled:
5-day: May 11, 2025 (2025-05-10T23:00:00.000Z)
2-day: May 14, 2025 (2025-05-13T23:00:00.000Z)
1-day: May 15, 2025 (2025-05-14T23:00:00.000Z)

2. Grace-Period Reminder Scheduling (May 16, 2025)

Context: Renewal date passes without renewal; cron job processSubscriptionTasks runs at 00:00:00 UTC (01:00:00 Africa/Lagos)
Now: 2025-05-16T01:00:00.000+01:00
Logic: Grace-period reminders scheduled for 1, 3, and 5 days after renewal date
Scheduled:
1-day: May 17, 2025 (2025-05-16T23:00:00.000Z)
3-day: May 19, 2025 (2025-05-18T23:00:00.000Z)
5-day: May 21, 2025 (2025-05-20T23:00:00.000Z)

3. Grace-Period Reminder Triggers

Cron Job: processReminderTasks runs every minute, sending emails for pending reminders when scheduledAt <= now
Triggers (at 00:00:00 Africa/Lagos, 23:00:00 UTC previous day):
May 17, 2025: "Your subscription is in grace period (1-day)"
May 19, 2025: "Your subscription is in grace period (3-day)"
May 21, 2025: "Your subscription is in grace period (5-day)"

Email: Sent to john.doe@example.com; reminder status updated to "sent"

4. When Reminders Stop

Last Reminder: May 21, 2025 (5-day grace-period)
Stop Triggering: After May 21, no further reminders are scheduled (per GRACE_PERIOD_REMINDERS = [1, 3, 5])
Grace Period: Subscription remains "active" until May 23, allowing manual renewal

5. Subscription Expiration

Cron Job: processSubscriptionTasks runs daily at 00:00:00 UTC
Logic:

const gracePeriodEnd = dayjs().utc().subtract(7, "day").toDate();
const subscriptionsToExpire = await Subscription.find({
status: "active",
renewalDate: { $lt: gracePeriodEnd },
}).populate("user_id", "timezone email name");
subscription.status = "expired";
await subscription.save();
await SubscriptionHistory.create({
subscriptionId: subscription.\_id,
action: "expired",
details: { renewalDate: subscription.renewalDate },
});

Timeline:
May 23, 2025: renewalDate (May 16) equals gracePeriodEnd (May 16), so not expired
May 24, 2025: renewalDate (May 16) < gracePeriodEnd (May 17)
Status: Updated to "expired"
History: Logged as "Expired subscription for John Doe (Netflix)"
Email: Sent (if implemented): "Your Netflix subscription has expired"

Expiration Date: May 24, 2025, 00:00:00 UTC (01:00:00 Africa/Lagos)

Summary of Key Dates

Now: 2025-05-09T11:00:00.000+01:00
Start Date: 2025-05-09T00:00:00.000Z
Renewal Date: 2025-05-16T00:00:00.000Z
Grace Period: May 16–23, 2025
Grace-Period Reminders:
May 17, 2025 (1-day)
May 19, 2025 (3-day)
May 21, 2025 (5-day)

Reminders Stop: After May 21, 2025
Expiration Date: May 24, 2025

Why Not Expire on May 21?

Grace period lasts 7 days (May 16–23), allowing renewal until the end
Last reminder (May 21) is on day 5, leaving 2 days (May 22–23) for renewal
Expiration occurs on May 24, when renewalDate is before gracePeriodEnd, ensuring the full 7-day grace period
