import { prisma } from "../../../lib/prisma.js";
import { ICreateReviewPayload } from "./review.interface.js";

const createReviewInDB = async (
  payload: ICreateReviewPayload,
  customerId: string,
) => {
  const { gearItemId, rentalOrderId, rating, comment } = payload;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: { rentalItems: true },
  });

  if (!rentalOrder) {
    throw new Error("Rental order not found");
  }

  if (rentalOrder.customerId !== customerId) {
    throw new Error("You can only review rental orders that belong to you");
  }

  if (rentalOrder.status !== "RETURNED") {
    throw new Error(
      "You can only review a gear item after the rental has been returned",
    );
  }

  const itemInOrder = rentalOrder.rentalItems.some(
    (item) => item.gearItemId === gearItemId,
  );

  if (!itemInOrder) {
    throw new Error(
      "This gear item was not part of the specified rental order",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      gearItemId,
      rentalOrderId,
    },
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this gear item for this rental order",
    );
  }

  const result = await prisma.review.create({
    data: {
      customerId,
      gearItemId,
      rentalOrderId,
      rating,
      comment,
    },
  });

  return result;
};

export const reviewService = {
  createReviewInDB,
};
