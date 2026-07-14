import { prisma } from "../../../lib/prisma.js";
import { IUpdateUserStatusPayload } from "./admin.interface.js";

const VALID_STATUSES = ["ACTIVE", "SUSPENDED"];

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    omit: { password: true },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const updateUserStatusInDB = async (
  id: string,
  payload: IUpdateUserStatusPayload,
) => {
  if (!payload.status || !VALID_STATUSES.includes(payload.status)) {
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (existingUser.role === "ADMIN") {
    throw new Error("Cannot change status of an admin account");
  }

  const result = await prisma.user.update({
    where: { id },
    data: { status: payload.status },
    omit: { password: true },
  });

  return result;
};

const getAllGearListingsFromDB = async () => {
  const result = await prisma.gearItem.findMany({
    include: {
      category: true,
      provider: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getAllRentalOrdersFromDB = async () => {
  const result = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      rentalItems: {
        include: { gearItem: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllGearListingsFromDB,
  getAllRentalOrdersFromDB,
};
