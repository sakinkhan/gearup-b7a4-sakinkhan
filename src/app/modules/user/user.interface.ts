import { UserRole } from "../../../../generated/prisma";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: Exclude<UserRole, "ADMIN">;
}

export type UpdateUserPayload = Partial<{
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}>;
