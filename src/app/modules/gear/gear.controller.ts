import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await gearService.createGear(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear created successfully",
      data: result,
    });
  },
);

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

const getAllGearCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getGearById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const gearController = {
  createGear,
  getAllGears,
  getAllGearCategories,
  getMyGears,
  getGearById,
  updateGear,
  deleteGear,
};
