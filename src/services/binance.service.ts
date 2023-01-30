import ccxt from "ccxt";

// Create an instance of the Binance exchange class
const binance = new ccxt.binance();

// Load the tickers data from Binance
binance.loadMarkets();

// Function to get ticker information for a specific ticker
export async function getTicker(ticker: string): Promise<ccxt.Ticker> {
    return binance.fetchTicker(ticker);
}

// Function to place a order
export function createOrder(
    ticker: string,
    type: string,
    side: "buy" | "sell",
    amount: number,
    price: number
): Promise<ccxt.Order> {
    return binance.createOrder(ticker, type, side, amount, price);
}

// Function to cancel an order
export async function cancelOrder(orderId: string): Promise<void> {
    await binance.cancelOrder(orderId);
}
