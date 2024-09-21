import mongoose from "mongoose";

const schema = new mongoose.Schema({
    maker: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    token_loan: {
        type: String,
        required: true,
    },
    amount_loan: {
        type: BigInt,
        required: true,
    },
    token_borrow: {
        type: String,
        required: true,
    },
    amount_borrow: {
        type: BigInt,
        required: true,
    },
    amount_repay: {
        type: BigInt,
        required: true,
    },
    seed: {
        type: BigInt,
        required: true,
    },
    curr_status: {
        type: Number,
        required: true,
    },
    expire_time: {
        type: BigInt,
        required: true,
    },
    duration: {
        type: BigInt,
        required: true,
    },
    apr: {
        type: Number,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    users: {
        type: [String],
        required: true,
    },
});

export const Listing = mongoose.model("Listing", schema);