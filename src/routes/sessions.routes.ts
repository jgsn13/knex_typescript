import { Router } from "express";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import knex from "../database/connection";
import authConfig from "../config/auth";

const sessionsRouter = Router();

sessionsRouter.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await knex("users").where("email", email).first();

    if (!user) throw "Credentials not found.";

    const comparePassword = await compare(password, user.password);

    if (!comparePassword) throw "Credentials not found.";

    const token = sign({}, authConfig.jwt.secret, {
      subject: String(user.id), // always must be the user id
      expiresIn: authConfig.jwt.expiresIn, // depends on application type
    });

    delete user.password;

    return response.json({ user, token });
  } catch (error) {
    console.log({ error });
    return response.status(400).json({ error });
  }
});

export default sessionsRouter;
