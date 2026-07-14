import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post("/register", userController.registerUser);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  userController.getMyUser,
);
router.put(
  "/myUser",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  userController.updateMyUser,
);

export const userRoutes = router;
