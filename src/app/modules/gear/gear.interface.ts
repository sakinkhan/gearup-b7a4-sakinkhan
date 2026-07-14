import { GearCondition, GearStatus } from "../../../../generated/prisma";

export interface ICreateGearPayload {
  categoryId: string;
  name: string;
  brand: string;
  description: string;
  rentalPricePerDay: number;
  depositAmount?: number;
  stock: number;
  availableStock: number;
  condition: GearCondition;
  status?: GearStatus;
  image?: string;
}

export interface IUpdateGearPayload {
  categoryId?: string;

  name?: string;
  brand?: string;
  description?: string;

  rentalPricePerDay?: number;
  depositAmount?: number;

  stock?: number;
  availableStock?: number;

  condition?: GearCondition;
  status?: GearStatus;

  image?: string;
}
