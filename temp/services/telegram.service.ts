import { Telegram } from 'telegraf'
import { Trade } from '../models/trade.model'
import { TradeType } from '../models/trade.interface';
import config from '../../src/config';


const bot = new Telegram(config.telegramBotToken as string)

// Function to send a message to the user
export function sendMessage(chatId: number, message: string) {
    bot.sendMessage(chatId, message)
}

// Function to send the trade information to the user
export async function sendTradeInfo(chatId: number, tradeId: string) {
    try {
        const trade = await Trade.findById(tradeId)
        if (!trade) {
            throw new Error(`Trade not found: ${tradeId}`)
        }
        bot.sendMessage(chatId, `Trade Info:
        Ticker: ${trade.ticker}
        Amount: ${trade.amount}
        Price: ${trade.price}
        Side: ${trade.side}
        Profit/Loss: ${trade.profitLoss}`)
    } catch (err) {
        console.log(err)
    }
}