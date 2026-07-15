import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await gearService.getAllGears();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear retrieved successfully",
      data: result,
    });
  },
);

const getGearById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.gearId;
    if (!gearId) {
      throw new Error("Gear Id Required In Params");
    }
    const result = await gearService.getGearById(gearId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear retrieved successfully",
      data: result,
    });
  },
);

export const gearController = {
  getAllGears,
  getGearById,
};
