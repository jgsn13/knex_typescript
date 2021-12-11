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

    const transaction = await knex.transaction();

    const newIds = await transaction('locations').insert(location);

    const locationId = newIds[0];

    const locationItems = items.map((item_id: number) => ({
      item_id,
      location_id: locationId,
    }));

    await transaction('location_items').insert(locationItems);

    await transaction.commit();

    return response.json({
      id: locationId,
      ...location,
      items,
    });
  } catch (error) {
    console.log(error);
    return response.json({ error });
  }
});

export default locationsRouter;
