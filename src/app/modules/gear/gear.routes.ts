import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.get("/", gearController.getAllGears);

router.get("/:gearId", gearController.getGearById);

export const gearRoutes = router;
