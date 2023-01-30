require('dotenv').config();


const config = {
    telegramBotToken: process.env.BOT_TOKEN,
    chatId: process.env.CHAT_ID,
    mongoDbUri: 'mongodb://localhost:27017/trades'
}

export default config;
