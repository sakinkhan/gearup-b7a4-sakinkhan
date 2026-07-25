import { NextFunction, Request, Response } from "express";
import config from "../../config";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: {
      name: err.name,
      ...(config.node_env === "development" && { stack: err.stack }),
    },
  });
};

export default globalErrorHandler;
