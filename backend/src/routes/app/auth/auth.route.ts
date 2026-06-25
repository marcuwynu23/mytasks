import { Router } from "express";
import { login, logout, profile, register } from "../../../controlllers/app/auth/auth.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", authMiddleware, profile);

export default authRouter;
