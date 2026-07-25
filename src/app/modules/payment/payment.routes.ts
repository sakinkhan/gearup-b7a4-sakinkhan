import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  paymentController.createPaymentSession,
);

router.post("/webhook", paymentController.handleStripeWebhook);

router.post(
  "/confirm",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  paymentController.confirmPayment,
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  paymentController.getMyPayments,
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;
