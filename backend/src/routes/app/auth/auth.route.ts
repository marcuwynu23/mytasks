import { Router } from "express";
import { getAuth } from "../../../controlllers/app/auth/auth.controller";

const authRouter: Router = Router();

authRouter.get("/", getAuth);

export default authRouter;
