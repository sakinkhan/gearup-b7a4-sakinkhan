import { Router, Request, Response } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post("/login", authController.loginUser);

router.get("/me", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), authController.getMe);

router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
