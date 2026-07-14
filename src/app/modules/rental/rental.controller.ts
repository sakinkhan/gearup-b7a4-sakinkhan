import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { rentalService } from "./rental.service.js";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const result = await rentalService.createRentalOrderInDB(
    req.body,
    customerId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental order created successfully",
    data: result,
  });
});

const getMyRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const result = await rentalService.getRentalOrdersByUserFromDB(customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental orders retrieved successfully",
    data: result,
  });
});

const getRentalOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = req.user!.id;
  const role = req.user!.role;

  const result = await rentalService.getRentalOrderByIdFromDB(
    id as string,
    customerId,
    role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order retrieved successfully",
    data: result,
  });
});

export const rentalController = {
  createRentalOrder,
  getMyRentalOrders,
  getRentalOrderById,
};
