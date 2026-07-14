export interface IRentalOrderItemInput {
  gearItemId: string;
  quantity: number;
}

export interface ICreateRentalOrderPayload {
  rentalStartDate: string;
  rentalEndDate: string;
  notes?: string;
  items: IRentalOrderItemInput[];
}
