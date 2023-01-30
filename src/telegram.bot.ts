import { Context, Telegraf, Telegram } from "telegraf";
import axios from "axios";

// Import the config file
import config from "./config";
// import { getTicker } from "./services/binance.service";

// Create a new instance of the Telegraf class and pass it your Telegram bot token
const bot: Telegraf<Context> = new Telegraf(config.telegramBotToken as string);
const telegram: Telegram = new Telegram(config.telegramBotToken as string);

// handle all errors
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

//================================================================================================
function sendStartMessage(ctx: Context) {
    let startMessage = "Welcome, this bot gives you cryptocurrency information";
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Crypto Prices", callback_data: "price" }],
                [{ text: "CoinMarketCap", url: "https://coinmarketcap.com/" }],
                [{ text: "Bot Info", callback_data: "info" }],
                [{ text: "Clear console", callback_data: "clear" }],
            ],
        },
    });
}

bot.command("start", ctx => {
    sendStartMessage(ctx);
});

bot.action("start", ctx => {
    ctx.deleteMessage();
    sendStartMessage(ctx);
});

bot.action("price", ctx => {
    ctx.deleteMessage();
    let priceMessage = "Please Price information. Select one of the cryptocurrencies below";
    bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "BTC", callback_data: "price-BTC" },
                    { text: "ETH", callback_data: "price-ETH" },
                ],
                [
                    { text: "BNB", callback_data: "price-BNB" },
                    { text: "ADA", callback_data: "price-ADA" },
                ],
                [{ text: "Back to Menu", callback_data: "start" }],
            ],
        },
    });
});

let priceActionList = ["price-BTC", "price-ETH", "price-BNB", "price-ADA"];
bot.action(priceActionList, async ctx => {
    let symbol = ctx.match.toString().split("-")[1];
    console.log(symbol);

    try {
        let res = await axios.get(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD`
        );
        let data = await res.data.DISPLAY[symbol].USD;
        console.log(data);
        ctx.deleteMessage();

        let message = `
        Symbol: ${symbol}
        Price: ${data.PRICE}
        Open: ${data.OPENDAY}
        High: ${data.HIGHDAY}
        Low: ${data.LOWDAY}
        Supply: ${data.SUPPLY}
        Market Cap: ${data.MKTCAP}
        `;

        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Back to Menu", callback_data: "start" }],
                    [{ text: "Back to Prices", callback_data: "price" }],
                ],
            },
        });
    } catch (error) {
        console.log(error);
    }
});

bot.action("info", ctx => {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
        reply_markup: {
            keyboard: [[{ text: "Credits" }, { text: "API" }], [{ text: "Remove Keyboard" }]],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });
});

bot.action("clear", async ctx => {
    let id = (await bot.telegram.sendMessage(ctx.chat.id, "Clearing console")).message_id;
    console.log(id);
    for(let i = 0; i <= 100; i++ ){
        try {
            ctx.deleteMessage(id - i);
        } catch (error) {
            console.log(error);
            break;
        }
    }
});


bot.hears("Credits", ctx => {
    ctx.reply("This bot was made by @name ");
});

bot.hears("API", ctx => {
    ctx.reply("This bot uses cryptocompare API");
});

bot.hears("Remove Keyboard", ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Keyboard removed", {
        reply_markup: {
            remove_keyboard: true,
        },
    });
});


//================================================================================================

// // Listen for the "/start" command
// bot.command("start", ctx => {
//     // Send a message back to the user
//     // call /help to see the available commands
//     ctx.reply("Hello " + ctx.from.first_name + "!");
// });

// bot.command("oldschool", ctx => ctx.reply("Hello"));
// bot.command("modern", Telegraf.reply("Yo"));

// bot.command("help", ctx => {
//     ctx.reply("Send /start to receive a greeting");
//     ctx.reply("Send /buy to place a buy order");
//     ctx.reply("Send /close to close a trade");
// });

// // Listen for the "/buy" command
// bot.command("buy", ctx => {
//     // Send a message back to the user
//     ctx.reply("Please provide the necessary information to buy");
// });

// // Listen for the "/close" command
// bot.command("close", ctx => {
//     // Send a message back to the user
//     ctx.reply("Please provide the necessary information to close the trade");
// });

// bot.command("echo", ctx => {
//     // Send a message back to the user
//     let param = ctx.message.text.split(" ")[1];
// });

// bot.command("ticker", async ctx => {
//     // Wait for the user to input the ticker symbol
//     ctx.reply("Please enter the ticker symbol (e.g. BTCUSDT)");

//     const ticker = ctx.message.text;

//     try {
//         const tickerData = await getTicker(ticker);
//         if (!tickerData) {
//             throw new Error(`Invalid ticker: ${ticker}`);
//         }
//         ctx.reply(`Ticker data for ${ticker}:\n\n ${JSON.stringify(tickerData)}`);
//     } catch (err: any) {
//         ctx.reply(`Error getting ticker data: ${err.message}`);
//     }
// });

export function startBot() {
    // Start listening for updates
    bot.launch();
    telegram.sendMessage(
        config.chatId as string,
        `.\n----------------------------------------------------------------
        Welcome to the Binance Bot! \n\nSend /start to see the available commands`
    );

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
