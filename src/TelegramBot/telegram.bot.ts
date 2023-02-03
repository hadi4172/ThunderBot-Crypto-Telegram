import { Context, Telegraf, Telegram } from "telegraf";

// Import the config file
import config from "../config";
// import { getTicker } from "./services/binance.service";

// Create a new instance of the Telegraf class and pass it your Telegram bot token
const bot: Telegraf<Context> = new Telegraf(config.telegramBotToken as string);
const telegram: Telegram = new Telegram(config.telegramBotToken as string);

let tempDb = {
    page: ""
};


let userInfos = {
    accountName: "",
    apiKey: "",
    secretKey: "",
};

//================================================================================================

export { bot, tempDb, userInfos, telegram };
