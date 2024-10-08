import { ClientConfig } from "pg";

require("dotenv").config();

export const pgConfig: ClientConfig = {
  user: process.env.PG_USER || "",
  host: process.env.PG_HOST || "",
  database: process.env.PG_DATABASE || "",
  password: process.env.PG_PASSWORD || "",
  port: parseInt(process.env.PG_PORT || ""),
};
