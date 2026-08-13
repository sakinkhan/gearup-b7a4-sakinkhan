import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);
router.patch(
  "/users/:id",
  auth(UserRole.ADMIN),
  adminController.updateUserStatus,
);
router.get("/gears", auth(UserRole.ADMIN), adminController.getAllGearListings);
router.patch(
  "/gears/:id/status",
  auth(UserRole.ADMIN),
  adminController.updateGearStatus,
);
router.get(
  "/rentals",
  auth(UserRole.ADMIN),
  adminController.getAllRentalOrders,
);

router.get(
  "/dashboard/stats",
  auth(UserRole.ADMIN),
  adminController.getDashboardStats,
);

export const adminRoutes = router;
