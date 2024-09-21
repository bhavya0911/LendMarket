import express from "express";
import { config } from "dotenv";
import cors from "cors";
import listingRoutes from "./routes/listing.js";

export const app = express();

config({
    path: "./data/config.env",
});

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use("/api/v1/listings", listingRoutes);