import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";



const authRouter = Router();

//Path: /api/v1/auth
authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/sign-out', authorize, signOut);


export default authRouter;