import { Listing } from "../models/listings.js";
import { successStatus } from "../utils/features.js";

export const fetchAll = async(req, res, next) => {
    try {
        const allListing = JSON.stringify(await Listing.find({}), (_, v) => typeof v === 'bigint' ? v.toString() : v);
        successStatus(res, null, 200, allListing);
    } catch (error) {
        console.error(error)
    }
}

export const userAll = async(req, res, next) => {
    try {
        const userListing = JSON.stringify(await Listing.find({}), (_, v) => typeof v === 'bigint' ? v.toString() : v);
        successStatus(res, null, 200, userListing);
    } catch (error) {
        next(error)
    }
}

export const newListing = async(req, res, next) => {
    try {
        await Listing.create({
            maker: "df",
            type: "sdg",
            token_loan: "sd",
            amount_loan: 45,
            token_borrow: "sdf",
            amount_borrow: 45,
            amount_repay: 45,
            seed: 454,
            curr_status: 235,
            expire_time: 1354,
            duration: 135,
            apr: 5,
            signature: "235",
            users: ["dgj", "adgf"]
        });
        successStatus(res, "Successfully", 201)
    } catch (error) {
        next(error);
    }
}

export const update = async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        listing.curr_status = 5;
        await listing.save();
        successStatus(res, "Updated", 200);
    } catch (error) {
        next(error)
    }
}