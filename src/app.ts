import express, { Application, Request, Response, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { prisma } from "./lib/prisma";
import { authRoutes } from "./app/modules/auth/auth.routes";
import { userRoutes } from "./app/modules/user/user.routes";
import { gearRoutes } from "./app/modules/gear/gear.routes";
import { categoryRoutes } from "./app/modules/category/category.routes";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gears", gearRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
