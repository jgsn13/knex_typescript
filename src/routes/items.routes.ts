import { Router } from 'express';
import knex from '../database/connection';

const itemsRouter = Router();

itemsRouter.get('/', async (request, response) => {
  const items = await knex('items').select('*');

  return response.json(items);
});

export default itemsRouter;
