import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/gear", auth(UserRole.PROVIDER), providerController.addGear);
router.get(
  "/my-gears",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  providerController.getMyGears,
);
router.patch(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.updateGear,
);
router.delete(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.deleteGear,
);
router.get(
  "/orders",
  auth(UserRole.PROVIDER),
  providerController.getIncomingOrders,
);
router.patch(
  "/orders/:id",
  auth(UserRole.PROVIDER),
  providerController.updateOrderStatus,
);

export const providerRoutes = router;
