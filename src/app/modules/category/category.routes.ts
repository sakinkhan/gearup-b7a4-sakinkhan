import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:name", categoryController.getSingleCategory);

// Admin-only routes
router.post("/", auth("ADMIN"), categoryController.createCategory);
router.patch("/:name", auth("ADMIN"), categoryController.updateCategory);
router.delete("/:name", auth("ADMIN"), categoryController.deleteCategory);

export const categoryRoutes = router;
