import { Router } from 'express';
import knex from '../database/connection';

const itemsRouter = Router();

itemsRouter.get('/', async (request, response) => {
  const items = await knex('items').select('*');

  const serializedItems = items.map((item) => {
    item.image = `${request.protocol}://${request.headers.host}/uploads/${item.image}`;
    return item;
  });

  return response.json(serializedItems);
});

export default itemsRouter;
