import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { gearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IGearFilters } from "./gear.interface";

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await gearService.getAllGears(req.query as IGearFilters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gears retrieved successfully",
      data: result.gears,
      meta: result.meta,
    });
  },
);

const getGearById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gearId } = req.params;

    if (!gearId) {
      throw new Error("Gear ID is required in params.");
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
