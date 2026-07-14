import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { rentalController } from "./rental.controller.js";

const router = Router();

router.post("/", auth(), rentalController.createRentalOrder);
router.get("/", auth(), rentalController.getMyRentalOrders);
router.get("/:id", auth(), rentalController.getRentalOrderById);

export const rentalRoutes = router;
