import { UserRole } from "../../generated/prisma";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
