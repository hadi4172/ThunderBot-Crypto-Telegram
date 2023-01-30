import { getTicker, createOrder, cancelOrder } from './binance.service'
import { saveTrade, getAllTrades, Trade } from '../models/trade.model'
import { TradeType } from '../models/trade.interface'


// Place a new trade order
export async function placeTradeOrder(ticker: string, amount: number, price: number, side: "buy" | "sell"): Promise<void> {
    try {
        const tickerData = await getTicker(ticker)
        if (!tickerData) {
            throw new Error(`Invalid ticker: ${ticker}`)
        }
        const order = await createOrder(ticker, "limit", side, amount, price)
        saveTrade(ticker, amount, price, side)
        console.log(`Order placed: ${order.id}`)
    } catch (err) {
        console.log(err)
    }
}

// Cancel an existing trade order
export async function cancelTradeOrder(orderId: string): Promise<void> {
    try {
        const result = await cancelOrder(orderId)
        console.log(`Order canceled: ${orderId}`)
    } catch (err) {
        console.log(err)
    }
}

// Get all trades
export function getTrades():Promise<Array<Trade>> {
    return getAllTrades()
}

export async function getTradeInfo(tradeId: string): Promise<Trade> {
    // Find the trade by its id
    const trade = await Trade.findById(tradeId)
    if (!trade) {
        throw new Error(`Invalid trade id: ${tradeId}`)
    }
    return trade;
}

export async function calculateProfitLoss(tradeId: string): Promise<number> {
    // Find the trade by its id
    const trade = await Trade.findById(tradeId)
    if (!trade) {
        throw new Error(`Invalid trade id: ${tradeId}`)
    }
    // Get the current ticker information
    const ticker = await getTicker(trade.ticker)
    if (!ticker) {
        throw new Error(`Invalid ticker: ${trade.ticker}`)
    }
    // Calculate the profit/loss
    let profitLoss = 0
    if (trade.side === 'buy') {
        profitLoss = (ticker.last - trade.price) * trade.amount
    } else {
        profitLoss = (trade.price - ticker.last) * trade.amount
    }
    return profitLoss
}
