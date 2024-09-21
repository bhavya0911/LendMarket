import BigNumber from "bignumber.js";
import { Listing } from "../models/listings.js";
import { successStatus } from "../utils/features.js";
import ErrorHandler from "../utils/error.js";

export const fetchAll = async(req, res, next) => {
    try {
        const allListing = await Listing.find({})
        successStatus(res, null, 200, allListing);
    } catch (error) {
        next(error)
    }
}

export const userAll = async(req, res, next) => {
    try {
        const userToFind = req.body.user;
        const userListing = await Listing.find({ users: userToFind });
        console.log(userListing)
        successStatus(res, null, 200, userListing);
    } catch (error) {
        next(error)
    }
}

export const newListing = async(req, res, next) => {
    try {
        const {
            maker,
            type,
            token_loan,
            amount_loan,
            token_borrow,
            amount_borrow,
            amount_repay,
            seed,
            curr_status,
            expire_time,
            duration,
            apr,
            signature,
            users
        } = req.body;
        console.log(signature)
        
        // await Listing.create({
        //     maker: "df",
        //     type: "sdg",
        //     token_loan: "sd",
        //     name_loan: "df",
        //     symbol_loan: "sfg",
        //     amount_loan: 45,
        //     token_borrow: "sdf",
        //     name_borrow: "sdf",
        //     symbol_borrow: "sdf",
        //     amount_borrow: 45,
        //     amount_repay: 45,
        //     seed: 454,
        //     curr_status: 235,
        //     expire_time: 1354,
        //     duration: 135,
        //     apr: 5,
        //     signature: "235",
        //     users: ["dgja", "adgf"]
        // });

        await Listing.create({
            maker,
            type,
            token_loan,
            amount_loan,
            token_borrow,
            amount_borrow,
            amount_repay,
            seed,
            curr_status,
            expire_time,
            duration,
            apr,
            signature,
            users
        });

        successStatus(res, "Successfully", 201);
    } catch (error) {
        next(error);
    }
}

export const update = async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.body.id);
        listing.curr_status = 5;
        await listing.save();
        successStatus(res, "Updated", 200);
    } catch (error) {
        next(error)
    }
}