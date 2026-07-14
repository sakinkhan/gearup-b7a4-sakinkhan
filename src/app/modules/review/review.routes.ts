import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);

export const reviewRoutes = router;
