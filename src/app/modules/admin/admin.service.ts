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

const updateGearStatusInDB = async (
  id: string,
  status: "AVAILABLE" | "INACTIVE",
) => {
  const existingGear = await prisma.gearItem.findUnique({
    where: { id },
  });

  if (!existingGear) {
    throw new Error("Gear listing not found");
  }

  if (!["AVAILABLE", "INACTIVE"].includes(status)) {
    throw new Error("Gear status must be AVAILABLE or INACTIVE");
  }

  return prisma.gearItem.update({
    where: { id },
    data: {
      status,
    },
  });
};

const getAllRentalOrdersFromDB = async () => {
  const result = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          image: true,
        },
      },

      rentalItems: {
        include: {
          gearItem: {
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  address: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getDashboardStatsFromDB = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    totalAdmins,
    totalGear,
    activeGear,
    totalRentals,
    activeRentals,

    pendingPayment,
    paid,
    confirmed,
    pickedUp,
    returned,
    completed,
    cancelled,
  ] = await Promise.all([
    // Users
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.user.count({
      where: {
        role: "PROVIDER",
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    // Gear
    prisma.gearItem.count(),

    prisma.gearItem.count({
      where: {
        status: {
          not: "INACTIVE",
        },
      },
    }),

    // Rentals
    prisma.rentalOrder.count(),

    prisma.rentalOrder.count({
      where: {
        status: {
          notIn: ["COMPLETED", "CANCELLED"],
        },
      },
    }),

    // Rental status breakdown
    prisma.rentalOrder.count({
      where: {
        status: "PENDING_PAYMENT",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "PAID",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "PICKED_UP",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "RETURNED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    totalUsers,
    totalCustomers,
    totalProviders,
    totalAdmins,

    totalGear,
    activeGear,

    totalRentals,
    activeRentals,

    rentalStatusCounts: {
      PENDING_PAYMENT: pendingPayment,
      PAID: paid,
      CONFIRMED: confirmed,
      PICKED_UP: pickedUp,
      RETURNED: returned,
      COMPLETED: completed,
      CANCELLED: cancelled,
    },
  };
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllGearListingsFromDB,
  updateGearStatusInDB,
  getAllRentalOrdersFromDB,
  getDashboardStatsFromDB,
};
