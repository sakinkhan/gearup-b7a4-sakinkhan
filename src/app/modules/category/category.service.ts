import { prisma } from "../../../lib/prisma";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const createCategoryInDB = async (payload: ICreateCategoryPayload) => {
  const { name, description, image } = payload;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new Error("Category name is required");
  }

  const trimmedName = name.trim();

  const existingCategory = await prisma.category.findUnique({
    where: { name: trimmedName },
  });

  if (existingCategory) {
    throw new Error("A category with this name already exists");
  }

  const result = await prisma.category.create({
    data: {
      name: trimmedName,
      description,
      image,
    },
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return result;
};

const getSingleCategoryFromDB = async (name: string) => {
  const result = await prisma.category.findUnique({
    where: { name },
  });

  if (!result) {
    throw new Error("Category not found");
  }

  return result;
};

const updateCategoryInDB = async (
  name: string,
  payload: IUpdateCategoryPayload,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  if (payload.name !== undefined) {
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      throw new Error("Category name cannot be empty");
    }
    payload.name = payload.name.trim();

    if (payload.name !== name) {
      const nameTaken = await prisma.category.findUnique({
        where: { name: payload.name },
      });

      if (nameTaken) {
        throw new Error("A category with this name already exists");
      }
    }
  }

  const result = await prisma.category.update({
    where: { name },
    data: payload,
  });

  return result;
};

const deleteCategoryFromDB = async (name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const result = await prisma.category.delete({
    where: { name },
  });

  return result;
};

export const categoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
