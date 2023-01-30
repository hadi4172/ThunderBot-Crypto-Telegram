import { placeTradeOrder, getTrades } from '../services/trade.service'
import { sendTradeInfo } from '../services/telegram.service'

export function handlePlaceOrder(ticker: string, amount: number, price: number, side: 'buy' | 'sell') {
    try {
        const order = placeTradeOrder(ticker, amount, price, side)
        console.log(`Order placed: ${order.id}`)
    } catch (err) {
        console.log(`Error placing order: ${err.message}`)
    }
}

export async function handleGetTrades(chatId: number) {
    const trades = await getTrades()
    trades.forEach(trade => {
        sendTradeInfo(chatId, trade)
    })
}
