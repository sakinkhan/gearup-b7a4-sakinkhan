import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

const getMyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   

    const profile = await userService.getMyUserFromDB(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User fetched successfully",
      data: { profile },
    });
  },
);

const updateMyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile = await userService.updateUserInDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: { updatedProfile },
    });
  },
);

export const userController = {
  registerUser,
  getMyUser,
  updateMyUser,
};
