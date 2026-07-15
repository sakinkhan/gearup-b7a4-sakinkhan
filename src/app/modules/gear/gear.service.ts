import { prisma } from "../../../lib/prisma";

const getAllGears = async () => {
  const gears = await prisma.gearItem.findMany({
    include: {
      provider: {
        omit: {
          password: true,
        },
      },
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
