import Router from 'express';
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { adminAuthorize } from '../middlewares/admin.middleware.js';

const userRouter = Router();

userRouter.get('/', authorize, adminAuthorize, getUsers); // Admin only
userRouter.get('/:id', authorize, getUser);

// Admin create user
userRouter.post('/', authorize, adminAuthorize, createUser);

// Authenticated user update own profile, admin update any
userRouter.put('/:id', authorize, updateUser);

// Admin delete user
userRouter.delete('/:id', authorize, adminAuthorize, deleteUser);

export default userRouter;

