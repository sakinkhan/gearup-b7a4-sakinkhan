import { prisma } from "../../../lib/prisma";
import { ICreateGearPayload, IUpdateGearPayload } from "./gear.interface";

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

const getGearById = async (gearId: string) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  return gear;
};

const getMyGears = async (providerId: string) => {
  const myGears = await prisma.gearItem.findMany({
    where: {
      providerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reviews: true,
    },
  });

  return myGears;
};

const updateGear = async (
  gearId: string,
  payload: IUpdateGearPayload,
  providerId: string,
  isAdmin: boolean,
) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  if (!isAdmin && gear.providerId !== providerId) {
    throw new Error("You are not the ownner of the gear");
  }

  const updatedGear = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data: payload,
  });

  return updatedGear;
};

const deleteGear = async (
  gearId: string,
  providerId: string,
  isAdmin: boolean,
) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  if (!isAdmin && gear.providerId !== providerId) {
    throw new Error("You are not the ownner of the gear");
  }

  await prisma.gearItem.delete({
    where: {
      id: gearId,
    },
  });
};

export const gearService = {
  createGear,
  getAllGears,
  getGearById,
  getMyGears,
  updateGear,
  deleteGear,
};
