export interface ICreateReviewPayload {
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment?: string;
}
