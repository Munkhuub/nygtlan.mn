import { Router } from "express";

import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { getMe, signin, signup } from "../controllers/auth";
import { changePassword } from "../controllers/auth/change-password";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/getMe", authenticationMiddleware, getMe);
authRouter.post("/change-password/:userId", changePassword);
export default authRouter;
