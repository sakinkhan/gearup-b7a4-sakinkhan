import { GearCondition, GearStatus } from "../../../../generated/prisma";

export interface ICreateGearPayload {
  categoryName: string;
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
  categoryName?: string;

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

export interface IGearFilters {
  categoryName?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  availableOnly?: string;
}
