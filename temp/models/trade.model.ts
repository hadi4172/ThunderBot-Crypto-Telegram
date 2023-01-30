import mongoose, { Model } from "mongoose";
import { Schema, model } from "mongoose";

// Connect to the MongoDB database
mongoose
    .connect("mongodb://localhost:27017/trades")
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.log(err));

// Define the trade schema
const tradeSchema = new Schema({
    ticker: String,
    amount: Number,
    price: Number,
    side: String,
    profitLoss: Number,
    date: { type: Date, default: Date.now }
})

// Create the trade model
export const Trade = model("Trade", tradeSchema);

// Function to save a new trade to the database
export function saveTrade(ticker: string, amount: number, price: number, side: string) {
    const trade = new Trade({ ticker, amount, price, side });
    trade
        .save()
        .then(() => console.log(`Trade ${ticker} saved to the database`))
        .catch(err => console.log(err));
}

// Function to get all trades from the database
export function getAllTrades() {
    return Trade.find({})
}