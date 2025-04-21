import { Server } from "@hapi/hapi";
import Joi from "joi";
import {
  fetchAndStoreCountries,
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../../controllers/countries.controller";

module.exports = {
  name: "countries-routes",
  register: async (server: Server) => {
    server.route([
      {
        method: "GET",
        path: "/fetch-countries",
        handler: fetchAndStoreCountries,
      },
      {
        method: "GET",
        path: "/countries",
        handler: getAllCountries,
        options: {
          validate: {
            query: Joi.object({
              search: Joi.string().optional(),
              region: Joi.string().optional(),
              sort: Joi.string().valid("name", "population").default("name"),
              order: Joi.string().valid("asc", "desc").default("asc"),
              page: Joi.number().integer().min(1).optional(),
              limit: Joi.number().integer().min(1).max(100).optional(),
            }),
          },
        },
      },
      { method: "POST", path: "/countries", handler: createCountry },
      { method: "PUT", path: "/countries/{id}", handler: updateCountry },
      { method: "DELETE", path: "/countries/{id}", handler: deleteCountry },
    ]);
  },
};
