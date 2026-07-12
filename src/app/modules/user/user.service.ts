import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { RegisterUserPayload, UpdateUserPayload } from "./user.interface";
import config from "../../../config";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, image, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image,
      role,
    },
    omit: {
      password: true,
    },
  });

  return createdUser;
};

const getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
  });
};

const getMyUserFromDB = async (id: string) => {
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });
};

const updateUserInDB = async (userId: string, payload: UpdateUserPayload) => {
  const { name, email, phone, address, image } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      phone,
      address,
      image,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const deleteUserFromDB = async (id: string) => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};

export const userService = {
  registerUserIntoDB,
  getAllUsersFromDB,
  getMyUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
