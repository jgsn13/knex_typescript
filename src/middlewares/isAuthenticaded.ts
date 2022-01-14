import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw "JWT Token is missing.";

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = verify(token, authConfig.jwt.secret);

      console.log(decodedToken);

      return next();
    } catch {
      throw "Invalid JWT Token.";
    }
  } catch (error) {
    console.log({ error });
    return response.status(401).json({ error });
  }
}
