import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";
import { IConfirmPaymentPayload } from "./payment.interface";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const { rentalOrderId } = req.body;
    const role = req.user?.role as string;
    const result = await paymentService.createPaymentInDB(
      rentalOrderId,
      customerId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message:
        "Payment session created successfully. Redirect to paymentUrl to complete payment.",
      data: result,
    });
  },
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const role = req.user?.role as string;
    const payload: IConfirmPaymentPayload = req.body;

    const result = await paymentService.confirmPaymentInDB(
      payload,
      customerId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: result,
    });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const role = req.user?.role as string;

    const result = await paymentService.getMyPaymentsFromDB(customerId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const customerId = req.user?.id as string;
    const role = req.user?.role as string;

    const result = await paymentService.getPaymentByIdFromDB(
      id as string,
      customerId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);

export const paymentController = {
  createPaymentSession,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  handleStripeWebhook,
};
