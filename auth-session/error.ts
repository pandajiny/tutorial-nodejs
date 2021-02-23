import { ErrorRequestHandler } from "express";

export const HttpStatus = {
  OK: 200,
  UNAUTHORIZED: 401,
};

export class HttpError {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).send(err.message);
  } else {
    console.error(err);
    res.status(500).send(`internal server error`);
  }
};
