import express from "express";
import { config } from "dotenv";
import listingRoutes from "./routes/listing.js";

export const app = express();

config({
    path: "./data/config.env",
});

app.use(express.json());

app.use("/api/v1/listings", listingRoutes);