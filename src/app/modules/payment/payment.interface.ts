export interface ICreatePaymentPayload {
  rentalOrderId: string;
  provider: "STRIPE";
}

export interface IConfirmPaymentPayload {
  transactionId: string;
}
