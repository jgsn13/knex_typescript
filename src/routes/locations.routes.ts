import { Router } from 'express';
import knex from '../database/connection';

const locationsRouter = Router();

locationsRouter.post('/', async (request, response) => {
  try {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } =
      request.body;

    const location = {
      image: 'fake-image.png',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await knex.transaction();
    try {
      const newIds = await knex('locations').transacting(trx).insert(location);

      const locationId = newIds[0];

      const locationItems = await Promise.all(
        items.map(async (item_id: number) => {
          const selectedItem = await knex('items')
            .transacting(trx)
            .where('id', item_id)
            .first();

          if (!selectedItem) throw 'Item not found.';

          return {
            item_id,
            location_id: locationId,
          };
        })
      );

      await trx('location_items').insert(locationItems);

      await trx.commit();

      return response.json({
        id: locationId,
        ...location,
        items,
      });
    } catch (err) {
      trx.rollback();

      throw err;
    }
  } catch (error) {
    console.log({ error });
    return response.json({ error });
  }
});

export default locationsRouter;
