import { sendMessage, sendTradeInfo } from '../services/telegram.service'
import { placeTradeOrder } from '../services/trade.service'

export async function handleBuyCommand(chatId: number, symbol: string, amount: number, price: number) {
    try {
        const trade = await placeTradeOrder(symbol, amount, price, 'buy')
        sendTradeInfo(chatId, trade)
    } catch (err) {
        sendMessage(chatId, `Error placing order: ${err.message}`)
    }
}
