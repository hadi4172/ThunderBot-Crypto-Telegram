require('dotenv').config();


const config = {
    telegramBotToken: process.env.BOT_TOKEN,
    chatId: process.env.CHAT_ID,
    mongoDbUri: 'mongodb://localhost:27017/trades',
    binanceApiKey: process.env.BINANCE_API_KEY,
    binanceSecretKey: process.env.BINANCE_SECRET_KEY
}

export default config;
