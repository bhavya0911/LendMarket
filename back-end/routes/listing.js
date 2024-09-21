import express from "express";
import {
    fetchAll,
    userAll,
    newListing,
    update
} from "../controllers/listings.js";

const router = express.Router();

router.get("/fetchAll", fetchAll);
router.get("/userAll", userAll);

router.post("/new", newListing);

router.put("/update/:id", update);

export default router;