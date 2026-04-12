import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            const error = new Error("No token provided");
            error.status = 401;
            throw error;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            const error = new Error("User not found");
            error.status = 401;
            throw error;
        }

        // ========== TOKEN VERSIONING IMPLEMENTATION START ==========
        // TOKEN VERSIONING VALIDATION FLOW (WITH DUMMY JWT TOKENS)
        /*
                // ==============================
                // 1. LOGIN / SIGNUP
                // ==============================
        
                // DB:
                // user.tokenVersion = 0
        
                // Fresh JWT created at login:
                const FRESH_TOKEN =
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                    "eyJ1c2VySWQiOiIxMjMiLCJ0b2tlblZlcnNpb24iOjB9." +
                    "signature_abc123"
        
                // decoded payload inside FRESH_TOKEN:
                // {
                //   userId: "123",
                //   tokenVersion: 0
                // }
        
        
                // ==============================
                // 2. FIRST REQUEST (VALID TOKEN)
                // ==============================
        
                // Request uses:
                Authorization: Bearer FRESH_TOKEN
        
                // Middleware check:
                DB tokenVersion = 0
                decoded tokenVersion = 0
                
                        // 0 === 0 → OK
                        // ✅ Access granted
                
                
                        // ==============================
                        // 3. SIGN OUT
                        // ==============================
                
                        // DB update:
                        user.tokenVersion = 1
                
                
                        // ==============================
                        // 4. REUSE OLD (STALE) TOKEN ❌
                        // ==============================
                
                        // Attacker / client still has OLD token:
                
                        const STALE_TOKEN =
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                            "eyJ1c2VySWQiOiIxMjMiLCJ0b2tlblZlcnNpb24iOjB9." +
                            "signature_abc123"
                
                        // decoded payload inside STALE_TOKEN:
                        // {
                        //   userId: "123",
                        //   tokenVersion: 0   ← OLD VALUE
                        // }
                
                        // DB now:
                        // user.tokenVersion = 1
                
                        // Middleware check:
                        if (1 !== 0) → TRUE
                
                        // ❌ RESULT:
                        // "Token has been revoked - please sign in again (401)"
                        // Access DENIED
                
                
                        // ==============================
                        // 5. NEW LOGIN AFTER LOGOUT
                        // ==============================
                
                        // DB tokenVersion = 1
                
                        // const NEW_TOKEN =
                        //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                        //     "eyJ1c2VySWQiOiIxMjMiLCJ0b2tlblZlcnNpb24iOjF9." +
                        //     "signature_def456"
                
                        // decoded payload:
                        // {
                        //   userId: "123",
                        //   tokenVersion: 1
                        // }
                
                        // Middleware check:
                        // DB tokenVersion = 1
                        // decoded tokenVersion = 1
                
                        // 1 === 1 → OK
                        // ✅ Access granted
                ========== TOKEN VERSIONING IMPLEMENTATION END ==========
                        */
        if (user.tokenVersion !== decoded.tokenVersion) {
            const error = new Error("Token has been revoked - please sign in again");
            error.status = 401;
            throw error;
        }

        req.user = user;
        // console.log(req);
        // console.log(req.user);

        next();
    } catch (error) {
        error.status = error.status || 401;
        error.message = error.message || "Unauthorized";
        next(error);
    }
};

export { authorize };