import { prisma } from "../../../lib/prisma";
import { ICreateGearPayload } from "./gear.interface";

const createGear = async (payload: ICreateGearPayload, userId: string) => {
  const result = await prisma.gearItem.create({
    data: {
      ...payload,
      providerId: userId,
      availableStock: payload.stock,
    },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });
  return result;
};

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

export const gearService = {
  createGear,
  getAllGears,
};
