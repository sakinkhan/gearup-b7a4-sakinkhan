import { UserRole } from "../../../../generated/prisma";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: UserRole;
}

export type UpdateUserPayload = Partial<{
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}>;
