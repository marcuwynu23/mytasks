import { Router } from "express";
import { changePasswordHandler, login, logout, profile, register, updateProfileHandler } from "@/controlllers/app/auth/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { changePasswordSchema, loginSchema, registerSchema, updateProfileSchema } from "@/validations/auth.validation";

const authRouter: Router = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/profile", authMiddleware, profile);
authRouter.put("/profile", authMiddleware, validate(updateProfileSchema), updateProfileHandler);
authRouter.put("/password", authMiddleware, validate(changePasswordSchema), changePasswordHandler);

export default authRouter;
