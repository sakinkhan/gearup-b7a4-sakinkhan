import express, { Application, Request, Response, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { authRoutes } from "./app/modules/auth/auth.routes";
import { userRoutes } from "./app/modules/user/user.routes";
import { gearRoutes } from "./app/modules/gear/gear.routes";
import { categoryRoutes } from "./app/modules/category/category.routes";
import { rentalRoutes } from "./app/modules/rental/rental.routes";
import { reviewRoutes } from "./app/modules/review/review.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";
import { providerRoutes } from "./app/modules/provider/provider.routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { paymentRoutes } from "./app/modules/payment/payment.routes";
import { stripe } from "./lib/stripe";

const app: Application = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
  "http://localhost:3000",
].filter(Boolean);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("FRONTEND_PROD_URL:", process.env.FRONTEND_PROD_URL);
console.log("ALLOWED ORIGINS:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  res.send("Welcome to GearUp Backend API");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gears", gearRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});
app.use(globalErrorHandler);
export default app;
