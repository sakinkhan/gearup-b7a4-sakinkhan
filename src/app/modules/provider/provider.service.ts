import { prisma } from "../../../lib/prisma.js";
import {
  ICreateProviderGearPayload,
  IUpdateProviderGearPayload,
  IUpdateProviderOrderStatusPayload,
} from "./provider.interface.js";

const ALLOWED_PROVIDER_STATUSES = ["CONFIRMED", "PICKED_UP", "RETURNED"];

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  CONFIRMED: ["PAID"],
  PICKED_UP: ["CONFIRMED"],
  RETURNED: ["PICKED_UP"],
};

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

const getMyGearsFromDB = async (providerId: string) => {
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
      gearItem: {
        providerId,
      },
    },
    include: {
      gearItem: true,
      rentalOrder: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      rentalOrder: {
        createdAt: "desc",
      },
    },
  });

  const groupedOrders = new Map<
    string,
    {
      id: string;
      customerId: string;
      totalAmount: string;
      rentalStartDate: Date;
      rentalEndDate: Date;
      totalDays: number;
      status: string;
      notes: string;
      createdAt: Date;
      updatedAt: Date;
      customer: {
        id: string;
        name: string;
        email: string;
      };
      rentalItems: typeof result;
    }
  >();

  for (const item of result) {
    const order = item.rentalOrder;

    if (!groupedOrders.has(order.id)) {
      groupedOrders.set(order.id, {
        id: order.id,
        customerId: order.customerId,
        totalAmount: order.totalAmount.toString(),
        rentalStartDate: order.rentalStartDate,
        rentalEndDate: order.rentalEndDate,
        totalDays: order.totalDays,
        status: order.status,
        notes: order.notes ?? "",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customer: order.customer,
        rentalItems: [],
      });
    }

    groupedOrders.get(order.id)!.rentalItems.push(item);
  }

  return Array.from(groupedOrders.values());
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
    include: {
      rentalItems: {
        include: {
          gearItem: true,
        },
      },
    },
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

  const allowedFrom = ALLOWED_TRANSITIONS[payload.status];

  if (!allowedFrom?.includes(rentalOrder.status)) {
    throw new Error(
      `Cannot move order from ${rentalOrder.status} to ${payload.status}`,
    );
  }

  // Actually update the order status
  const updatedOrder = await prisma.rentalOrder.update({
    where: {
      id: rentalOrderId,
    },
    data: {
      status: payload.status,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rentalItems: {
        include: {
          gearItem: true,
        },
      },
    },
  });

  return updatedOrder;
};

export const providerService = {
  addGearInDB,
  getMyGearsFromDB,
  updateGearInDB,
  deleteGearInDB,
  getIncomingOrdersFromDB,
  updateOrderStatusInDB,
};
