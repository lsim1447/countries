import { Server } from "@hapi/hapi";
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
      { method: "GET", path: "/countries", handler: getAllCountries },
      { method: "POST", path: "/countries", handler: createCountry },
      { method: "PUT", path: "/countries/{id}", handler: updateCountry },
      { method: "DELETE", path: "/countries/{id}", handler: deleteCountry },
    ]);
  },
};
