import { Prisma } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import { IGearFilters } from "./gear.interface";

const getAllGears = async (filters: IGearFilters) => {
  const { categoryName, minPrice, maxPrice, brand, availableOnly } = filters;

  const where: Prisma.GearItemWhereInput = {};

  if (categoryName) {
    where.categoryName = categoryName;
  }

  if (brand) {
    where.brand = { contains: brand, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    where.rentalPricePerDay = {
      ...(minPrice && { gte: Number(minPrice) }),
      ...(maxPrice && { lte: Number(maxPrice) }),
    };
  }

  if (availableOnly === "true") {
    where.availableStock = { gt: 0 };
    where.status = "AVAILABLE";
  }

  const gears = await prisma.gearItem.findMany({
    where,
    include: {
      provider: { omit: { password: true } },
      reviews: true,
    },
  });

  return gears;
};

const getGearById = async (gearId: string) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  return gear;
};

export const gearService = {
  getAllGears,
  getGearById,
};
