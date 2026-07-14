import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const result = await reviewService.createReviewInDB(req.body, customerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
