import { Router } from "express";
import { hash } from "bcryptjs";
import knex from "../database/connection";

const usersRouter = Router();

usersRouter.get("/", async (_request, response) => {
  try {
    const users = await knex("users").select("*");
    return response.json(users);
  } catch (err) {
    console.log({ err });
    return response.status(400).json({ err });
  }
});

usersRouter.post("/", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const passwordHash = await hash(password, 8);

    const user = { name, email, password: passwordHash };

    const newIds = await knex("users").insert(user);

    return response.json({
      id: newIds[0],
      ...user,
    });
  } catch (err) {
    console.log({ err });
    return response.status(400).json({ err });
  }
});

export default usersRouter;
