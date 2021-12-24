import { Router } from "express";
import multer from "multer";
import { celebrate, Joi } from "celebrate";
import knex from "../database/connection";
import multerConfig from "../config/multer";

const locationsRouter = Router();

const upload = multer(multerConfig);

locationsRouter.get("/", async (request, response) => {
  try {
    const { city, uf, items } = request.query;

    // Parsing items id from items query param
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const locations =
      city && uf && items
        ? await knex("locations")
            .join(
              "location_items",
              "locations.id",
              "=",
              "location_items.location_id"
            )
            .whereIn("location_items.item_id", parsedItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select("locations.*")
        : await knex("locations").select("*");

    return response.json(locations);
  } catch (error) {
    console.log({ error });
    return response.status(400).json({ error });
  }
});

locationsRouter.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const trx = await knex.transaction();

    try {
      const location = await knex("locations")
        .transacting(trx)
        .where("id", id)
        .first();

      if (!location) throw "Location not found.";

      const items = await knex("items")
        .transacting(trx)
        .join("location_items", "items.id", "=", "location_items.item_id")
        .where("location_items.location_id", id)
        .select("items.title");

      trx.commit();

      return response.json({
        ...location,
        items,
      });
    } catch (err) {
      trx.rollback();
      throw err;
    }
  } catch (error) {
    console.log({ error });
    return response.status(400).json({ error });
  }
});

locationsRouter.post(
  "/",
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.array().required(),
      }),
    },
    { abortEarly: false }
  ),
  async (request, response) => {
    try {
      const { name, email, whatsapp, latitude, longitude, city, uf, items } =
        request.body;

      const location = {
        image: "fake-image.png",
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
        const newIds = await knex("locations")
          .transacting(trx)
          .insert(location);

        const locationId = newIds[0];

        const locationItems = await Promise.all(
          items.map(async (item_id: number) => {
            const selectedItem = await knex("items")
              .transacting(trx)
              .where("id", item_id)
              .first();

            if (!selectedItem) throw "Item not found.";

            return {
              item_id,
              location_id: locationId,
            };
          })
        );

        await trx("location_items").insert(locationItems);

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
      return response.status(400).json({ error });
    }
  }
);

locationsRouter.put(
  "/:id",
  upload.single("image"),
  async (request, response) => {
    try {
      const { id } = request.params;

      const image = request.file?.filename;

      const location = await knex("locations").where("id", id).first();

      if (!location) throw "Location not found.";

      const locationUpdated = { ...location, image };

      await knex("locations").update(locationUpdated).where("id", id);

      return response.json(locationUpdated);
    } catch (error) {
      console.log({ error });
      return response.status(400).json({ error });
    }
  }
);

export default locationsRouter;
