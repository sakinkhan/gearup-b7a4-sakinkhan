export interface ICreateProviderGearPayload {
  categoryName: string;
  name: string;
  brand?: string;
  description: string;
  rentalPricePerDay: number;
  depositAmount?: number;
  stock: number;
  availableStock: number;
  condition: "NEW" | "GOOD" | "FAIR" | "USED";
  image?: string;
}

export interface IUpdateProviderGearPayload {
  categoryName?: string;
  name?: string;
  brand?: string;
  description?: string;
  rentalPricePerDay?: number;
  depositAmount?: number;
  stock?: number;
  availableStock?: number;
  condition?: "NEW" | "GOOD" | "FAIR" | "USED";
  image?: string;
}

export interface IUpdateProviderOrderStatusPayload {
  status: "CONFIRMED" | "PICKED_UP" | "RETURNED";
}
