import { NextFunction, Request, Response } from "express";

export default function requestLogger(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const { method, url } = request;
  const formatedMethod =
    method === "GET"
      ? "\x1b[32mGET\x1b[0m"
      : method === "POST"
        ? "\x1b[33mPOST\x1b[0m"
        : method === "PUT"
          ? "\x1b[34mPUT\x1b[0m"
          : method === "PATCH"
            ? "\x1b[37mPATCH\x1b[0m"
            : method === "DELETE\x1b[0m"
              ? "\x1b[31mDELETE"
              : `${method}`;

  console.log(`[${formatedMethod}] ${url}`);

  return next();
}
