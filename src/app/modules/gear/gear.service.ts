import { Prisma } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import { IGearFilters } from "./gear.interface";

const getAllGears = async (filters: IGearFilters) => {
  const {
    search,
    categoryName,
    minPrice,
    maxPrice,
    brand,
    availableOnly,
    status,
    page = 1,
    limit = 8,
  } = filters;

  const where: Prisma.GearItemWhereInput = {};

  // Search by name, brand, description, or category
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        categoryName: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (categoryName) {
    where.categoryName = {
      equals: categoryName,
      mode: "insensitive",
    };
  }

  if (brand) {
    where.brand = {
      contains: brand,
      mode: "insensitive",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.rentalPricePerDay = {
      ...(minPrice !== undefined && {
        gte: Number(minPrice),
      }),
      ...(maxPrice !== undefined && {
        lte: Number(maxPrice),
      }),
    };
  }

  if (status === "AVAILABLE") {
    where.status = "AVAILABLE";
    where.availableStock = {
      gt: 0,
    };
  } else if (status) {
    where.status = status;
  }

  if (availableOnly === "true") {
    where.availableStock = {
      gt: 0,
    };

    where.status = "AVAILABLE";
  }

  const currentPage = Number(page);
  const currentLimit = Number(limit);
  const skip = (currentPage - 1) * currentLimit;

  const [gears, total] = await prisma.$transaction([
    prisma.gearItem.findMany({
      where,
      skip,
      take: currentLimit,
      include: {
        provider: {
          omit: {
            password: true,
          },
        },
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.gearItem.count({
      where,
    }),
  ]);

  return {
    gears,
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};

const getGearById = async (gearId: string) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
    include: {
      provider: {
        omit: {
          password: true,
        },
      },
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return gear;
};

export const gearService = {
  getAllGears,
  getGearById,
};
