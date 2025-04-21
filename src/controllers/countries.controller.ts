import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "../db/prisma";
import axios from "axios";

export const fetchAndStoreCountries = async (
  _req: Request,
  h: ResponseToolkit
) => {
  try {
    const response = await axios.get(
      "https://restfulcountries.com/api/v1/countries",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        },
      }
    );
    const data: any = response?.data?.data || [];

    const formatted = data.map((country: any) => ({
      name: country.name,
      capital: country.capital || "N/A",
      region: country?.region || "N/A",
      population: parseInt((country?.population || "0").replace(/,/g, "")),
      flag: country?.flag || "N/A",
    }));

    await prisma.country.deleteMany();
    await prisma.country.createMany({ data: formatted });

    return h.response({
      message: "Countries fetched and stored successfully.",
    });
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to fetch countries." }).code(500);
  }
};

export const getAllCountries = async (_req: Request, h: ResponseToolkit) => {
  try {
    const countries = await prisma.country.findMany();
    return h.response(countries);
  } catch (err) {
    return h.response({ error: "Failed to fetch countries." }).code(500);
  }
};

export const createCountry = async (req: Request, h: ResponseToolkit) => {
  try {
    const country = await prisma.country.create({ data: req.payload as any });
    return h.response(country).code(201);
  } catch (err) {
    return h.response({ error: "Failed to create country." }).code(500);
  }
};

export const updateCountry = async (req: Request, h: ResponseToolkit) => {
  try {
    const { id } = req.params;
    const updated = await prisma.country.update({
      where: { id: parseInt(id) },
      data: req.payload as any,
    });
    return h.response(updated);
  } catch (err) {
    return h.response({ error: "Failed to update country." }).code(500);
  }
};

export const deleteCountry = async (req: Request, h: ResponseToolkit) => {
  try {
    const { id } = req.params;
    await prisma.country.delete({ where: { id: parseInt(id) } });
    return h.response({ message: "Country deleted." });
  } catch (err) {
    return h.response({ error: "Failed to delete country." }).code(500);
  }
};
