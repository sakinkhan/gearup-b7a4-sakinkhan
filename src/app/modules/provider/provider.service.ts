import { prisma } from "../../../lib/prisma.js";
import {
  ICreateProviderGearPayload,
  IUpdateProviderGearPayload,
  IUpdateProviderOrderStatusPayload,
} from "./provider.interface.js";

const ALLOWED_PROVIDER_STATUSES = ["CONFIRMED", "PICKED_UP", "RETURNED"];

const addGearInDB = async (
  payload: ICreateProviderGearPayload,
  providerId: string,
) => {
  const category = await prisma.category.findUnique({
    where: { name: payload.categoryName },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const result = await prisma.gearItem.create({
    data: {
      ...payload,
      providerId,
    },
  });

  return result;
};

const updateGearInDB = async (
  id: string,
  payload: IUpdateProviderGearPayload,
  providerId: string,
) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: { id },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  if (gearItem.providerId !== providerId) {
    throw new Error("You do not own this gear listing");
  }

  if (payload.categoryName) {
    const category = await prisma.category.findUnique({
      where: { name: payload.categoryName },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const result = await prisma.gearItem.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteGearInDB = async (id: string, providerId: string) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: { id },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  if (gearItem.providerId !== providerId) {
    throw new Error("You do not own this gear listing");
  }

  const result = await prisma.gearItem.delete({
    where: { id },
  });

  return result;
};

const getIncomingOrdersFromDB = async (providerId: string) => {
  const result = await prisma.rentalOrderItem.findMany({
    where: {
      gearItem: { providerId },
    },
    include: {
      gearItem: true,
      rentalOrder: {
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { rentalOrder: { createdAt: "desc" } },
  });

  return result;
};

const updateOrderStatusInDB = async (
  rentalOrderId: string,
  payload: IUpdateProviderOrderStatusPayload,
  providerId: string,
) => {
  if (!payload.status || !ALLOWED_PROVIDER_STATUSES.includes(payload.status)) {
    throw new Error(
      `Status must be one of: ${ALLOWED_PROVIDER_STATUSES.join(", ")}`,
    );
  }

  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: { rentalItems: { include: { gearItem: true } } },
  });

  if (!rentalOrder) {
    throw new Error("Rental order not found");
  }

  const ownsAnItem = rentalOrder.rentalItems.some(
    (item) => item.gearItem.providerId === providerId,
  );

  if (!ownsAnItem) {
    throw new Error("You do not have any gear items in this rental order");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: payload.status },
    });

    if (payload.status === "RETURNED") {
      for (const item of rentalOrder.rentalItems) {
        await tx.gearItem.update({
          where: { id: item.gearItemId },
          data: { availableStock: { increment: item.quantity } },
        });
      }
    }

    return updatedOrder;
  });

  return result;
};

export const providerService = {
  addGearInDB,
  updateGearInDB,
  deleteGearInDB,
  getIncomingOrdersFromDB,
  updateOrderStatusInDB,
};
