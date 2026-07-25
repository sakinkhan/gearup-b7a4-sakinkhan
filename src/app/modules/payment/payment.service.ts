import Stripe from "stripe";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";
import httpStatus from "http-status";
import {
  IConfirmPaymentPayload,
  ICreatePaymentPayload,
} from "./payment.interface";

const createPaymentInDB = async (
  rentalOrderId: string,
  customerId: string,
  role: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rentalOrder.findUniqueOrThrow({
      where: { id: rentalOrderId },
    });

    if (rentalOrder?.customerId !== customerId && role !== "ADMIN") {
      throw new Error("You do not have access to this rental order");
    }
    if (rentalOrder.status !== "CONFIRMED") {
      throw new Error(
        "Rental order must be confirmed by the provider before payment",
      );
    }

    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: rentalOrder.customerId,
      },
      include: {
        rentalOrders: true,
      },
    });

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;

      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `Rental Order #${rentalOrder.id}`,
            },
            unit_amount: Math.round(Number(rentalOrder.totalAmount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/rentals/${rentalOrder.id}?success=true`,
      cancel_url: `${config.app_url}/rentals/${rentalOrder.id}?success=false`,
      metadata: { rentalOrderId: rentalOrder.id },
    });

    await tx.payment.create({
      data: {
        rentalOrderId: rentalOrder.id,
        transactionId: session.id,
        provider: "STRIPE",
        amount: rentalOrder.totalAmount,
        status: "PENDING",
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const confirmPaymentInDB = async (
  payload: IConfirmPaymentPayload,
  customerId: string,
  role: string,
) => {
  const { transactionId } = payload;
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: { rentalOrder: true },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.rentalOrder.customerId !== customerId && role !== "ADMIN") {
    throw new Error("You do not have access to this payment");
  }

  const session = await stripe.checkout.sessions.retrieve(transactionId);

  if (session.payment_status !== "paid") {
    return {
      ...payment,
      message: `Payment not completed yet (status: ${session.payment_status})`,
    };
  }

  const updatedPayment = await prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: { id: payment.rentalOrderId },
      data: { status: "PAID" },
    });

    return updated;
  });

  return updatedPayment;
};

const getMyPaymentsFromDB = async (customerId: string, role: string) => {
  const result = await prisma.payment.findMany({
    where:
      role === "ADMIN"
        ? {}
        : {
            rentalOrder: {
              customerId,
            },
          },
    include: {
      rentalOrder: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getPaymentByIdFromDB = async (
  id: string,
  customerId: string,
  role: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rentalOrder: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.rentalOrder.customerId !== customerId && role !== "ADMIN") {
    throw new Error("You do not have access to this payment");
  }

  return payment;
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret as string,
    );
  } catch (err) {
    throw new Error(
      `Webhook signature verification failed: ${(err as Error).message}`,
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
          where: { transactionId: session.id },
        });

        if (!payment) return;

        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        await tx.rentalOrder.update({
          where: { id: payment.rentalOrderId },
          data: { status: "PAID" }, // was: "CONFIRMED"
        });
      });

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.payment.updateMany({
        where: { transactionId: session.id },
        data: { status: "FAILED" },
      });

      break;
    }

    default:
      break;
  }

  return { received: true };
};

export const paymentService = {
  createPaymentInDB,
  confirmPaymentInDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
  handleWebhook,
};
