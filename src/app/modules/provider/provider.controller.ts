import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { providerService } from "./provider.service";

const addGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  const result = await providerService.addGearInDB(req.body, providerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gear added successfully",
    data: result,
  });
});

const getMyGears = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id;
  const result = await providerService.getMyGearsFromDB(providerId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Gears retrieved successfully",
    data: result,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const providerId = req.user!.id;
  const result = await providerService.updateGearInDB(
    id as string,
    req.body,
    providerId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const providerId = req.user!.id;
  const result = await providerService.deleteGearInDB(id as string, providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear removed successfully",
    data: result,
  });
});

const getIncomingOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  const result = await providerService.getIncomingOrdersFromDB(providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Incoming orders retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const providerId = req.user!.id;
  const result = await providerService.updateOrderStatusInDB(
    id as string,
    req.body,
    providerId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order status updated successfully",
    data: result,
  });
});

export const providerController = {
  addGear,
  getMyGears,
  updateGear,
  deleteGear,
  getIncomingOrders,
  updateOrderStatus,
};
