import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { adminAuthorize } from "../middlewares/admin.middleware.js";
import {
    createSubscription,
    getUserSubscriptions,
    renewSubscription,
    getSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    cancelSubscription,
    getUpcomingRenewals
} from "../controllers/subscription.controller.js";


const subscriptionRouter = Router();

// Admin get all
subscriptionRouter.get('/', authorize, adminAuthorize, getSubscriptions);

// Owner or admin get single
subscriptionRouter.get('/:id', authorize, getSubscriptionById);

// Authenticated user create
subscriptionRouter.post('/', authorize, createSubscription);

// Owner or admin update
subscriptionRouter.put('/:id', authorize, updateSubscription);

// Owner or admin delete
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// User get own subs
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// Renew
subscriptionRouter.post("/renew", authorize, renewSubscription);

// Owner or admin cancel
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// Auth get upcoming renewals
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
