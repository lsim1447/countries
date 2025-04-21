import dotenv from "dotenv";
import { createServer } from "./config/server";

dotenv.config();

const start = async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

start();
