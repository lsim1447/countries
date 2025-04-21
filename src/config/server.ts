import Hapi from "@hapi/hapi";

export const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
  });

  await server.register([require("../api/routes/countries.route")]);

  return server;
};
