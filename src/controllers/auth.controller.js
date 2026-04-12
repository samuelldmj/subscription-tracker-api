import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// Extend dayjs with both utc and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const signUp = async (req, res, next) => {
    try {
        const { name, email, password, timezone } = req.body;

        if (timezone && !dayjs.tz.zone(timezone)) {
            const err = new Error("Invalid timezone");
            err.statusCode = 400;
            return next(err);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (let schema handle default timezone)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            ...(timezone && { timezone }),
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    timezone: newUser.timezone,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};


const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const getUserByEmail = await User.findOne({ email });
        if (!getUserByEmail) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, getUserByEmail.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: getUserByEmail._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: {
                    _id: getUserByEmail._id,
                    name: getUserByEmail.name,
                    email: getUserByEmail.email,
                    timezone: getUserByEmail.timezone,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const signOut = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "User signed out successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { signUp, signIn, signOut };