import User from "../models/user.model.js";

const adminAuthorize = async (req, res, next) => {
    try {
        // req.user from auth.middleware.js
        if (req.user.role !== 'admin') {
            const error = new Error("Admin access required");
            error.status = 403;
            throw error;
        }
        next();
    } catch (error) {
        error.status = error.status || 403;
        next(error);
    }
};

export { adminAuthorize };

