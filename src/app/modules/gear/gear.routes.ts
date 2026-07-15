import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  gearController.createGear,
);

router.get("/", gearController.getAllGears);

router.get(
  "/my-gears",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  gearController.getMyGears,
);

router.get("/:gearId", gearController.getGearById);

router.patch(
  "/:gearId",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  gearController.updateGear,
);
router.delete(
  "/:gearId",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  gearController.deleteGear,
);

export const gearRoutes = router;
