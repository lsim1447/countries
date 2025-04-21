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

    // Map the data and ensure that fields are valid (not empty)
    const formatted = data.map((country: any) => ({
      name: country.name,
      capital:
        country.capital && country.capital.trim() !== ""
          ? country.capital
          : null,
      region:
        country?.region && country?.region.trim() !== ""
          ? country?.region
          : null,
      population: parseInt((country?.population || "0").replace(/,/g, "")),
      flag: country?.flag || null, // Store null for missing flag
    }));

    console.log(formatted); // Log the formatted data

    // Clear existing countries and insert the new ones
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

export const getAllCountries = async (req: Request, h: ResponseToolkit) => {
  try {
    const {
      search,
      region,
      sort = "name",
      order = "asc",
      page,
      limit,
    } = req.query as Record<string, string>;

    // Initialize the "where" filter object
    const where: any = {};

    // Apply search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { capital: { contains: search, mode: "insensitive" } },
      ];
    }

    // Apply region filter if provided (only if `region` is passed in the query)
    if (region) {
      where.region = { equals: region, mode: "insensitive" }; // Filter by region (case-insensitive)
    }

    // If no pagination (i.e., no page or limit provided), fetch all countries
    let take, skip;
    if (limit && page) {
      take = parseInt(limit) > 0 ? parseInt(limit) : undefined;
      skip =
        take && page && parseInt(page) > 0
          ? (parseInt(page) - 1) * parseInt(limit)
          : undefined;
    } else {
      // No pagination (fetch all countries)
      take = undefined;
      skip = undefined;
    }

    // Fetch countries with optional filters and pagination (or no pagination)
    const countries = await prisma.country.findMany({
      where,
      orderBy: { [sort]: order }, // Sorting by name or population
      skip,
      take, // If no pagination is applied, `take` will be `undefined`
    });

    // If pagination is applied, calculate total for pagination metadata
    const total = take
      ? await prisma.country.count({ where })
      : countries.length;

    return h.response({
      data: countries,
      meta: take
        ? {
            total,
            page: parseInt(page),
            limit: take,
            pages: Math.ceil(total / take), // Calculate total pages
          }
        : undefined, // If no pagination, don't include metadata
    });
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to query countries." }).code(500);
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
