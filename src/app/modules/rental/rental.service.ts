import { prisma } from "../../../lib/prisma.js";
import { ICreateRentalOrderPayload } from "./rental.interface.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const createRentalOrderInDB = async (
  payload: ICreateRentalOrderPayload,
  customerId: string,
) => {
  const { rentalStartDate, rentalEndDate, notes, items } = payload;

  if (!items || items.length === 0) {
    throw new Error("At least one gear item is required");
  }

  const startDate = new Date(rentalStartDate);
  const endDate = new Date(rentalEndDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid rental start or end date");
  }

  if (endDate <= startDate) {
    throw new Error("Rental end date must be after start date");
  }

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
  );

  const result = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData: {
      gearItemId: string;
      quantity: number;
      pricePerDay: number;
      totalPrice: number;
    }[] = [];

    for (const item of items) {
      const gearItem = await tx.gearItem.findUnique({
        where: { id: item.gearItemId },
      });

      if (!gearItem) {
        throw new Error(`Gear item not found: ${item.gearItemId}`);
      }

      if (item.quantity < 1) {
        throw new Error(`Quantity must be at least 1 for ${gearItem.name}`);
      }

      if (gearItem.availableStock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${gearItem.name}. Available: ${gearItem.availableStock}`,
        );
      }

      const totalPrice = gearItem.rentalPricePerDay * item.quantity * totalDays;
      totalAmount += totalPrice;

      orderItemsData.push({
        gearItemId: gearItem.id,
        quantity: item.quantity,
        pricePerDay: gearItem.rentalPricePerDay,
        totalPrice,
      });

      await tx.gearItem.update({
        where: { id: gearItem.id },
        data: { availableStock: { decrement: item.quantity } },
      });
    }

    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId,
        totalAmount,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        totalDays,
        notes,
        rentalItems: {
          create: orderItemsData,
        },
      },
      include: {
        rentalItems: {
          include: { gearItem: true },
        },
      },
    });

    return rentalOrder;
  });

  return result;
};

const getRentalOrdersByUserFromDB = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: { customerId },
    include: {
      rentalItems: {
        include: { gearItem: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getRentalOrderByIdFromDB = async (
  id: string,
  customerId: string,
  role: string,
) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: { id },
    include: {
      rentalItems: {
        include: { gearItem: true },
      },
      payments: true,
    },
  });

  if (!rentalOrder) {
    throw new Error("Rental order not found");
  }

  if (rentalOrder.customerId !== customerId && role !== "ADMIN") {
    throw new Error("You do not have access to this rental order");
  }

  return rentalOrder;
};

export const rentalService = {
  createRentalOrderInDB,
  getRentalOrdersByUserFromDB,
  getRentalOrderByIdFromDB,
};
