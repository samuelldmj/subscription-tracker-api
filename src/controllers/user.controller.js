import User from "../models/user.model.js";


const getUsers = async (req, res, next) => {

    try {
        const users = await User.find();

        res.status(200).json({ success: true, data: users })
    } catch (error) {
        next(error);
    }
}


const getUser = async (req, res, next) => {

    try {
        // console.log(req.params.id);
        console.log(req.params);
        // console.log(req);
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error);
    }
}


const createUser = async (req, res, next) => {
    try {
        const { name, email, password, timezone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully (admin)',
            data: { name, email, timezone }
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Owner or admin check
        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: 'User deleted successfully (admin)', data: { id: req.params.id } });
    } catch (error) {
        next(error);
    }
};


export {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}

























