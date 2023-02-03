import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "./telegram.bot";
import { convertOrderToString, deleteMessages, detectAndParseOrderString } from "../utils";
import {
    cancelOrderPage,
    confirmOrderPage,
    editOrderPage,
    confirmSettingsPage,
    menuPage,
} from "./exporters/pageExporter";

import { telegram } from  "./exporters/generalExporter";

import config from "../config";


bot.hears(/.*↓↓↓↓↓↓↓↓.*/g, ctx => {
    console.log("Reply received");
    let text = ctx.message.text;
    let parts = text.split("\n");
    switch (tempDb.page) {
        case "authenticationPage":
            let accountName = parts[1].split("Account Name : ")[1];
            let apiKey = parts[2].split("API Key : ")[1];
            let secretKey = parts[3].split("Secret Key : ")[1];

            userInfos.accountName = accountName;
            userInfos.apiKey = apiKey;
            userInfos.secretKey = secretKey;

            ctx.sendMessage("Bot created successfully");

            menuPage(ctx);

            console.log(userInfos);
            break;
        case "menuPage":
            let actionOnOrder: string = parts[1].split(" : ")[0];
            let orderId: number = parseInt(parts[1].split(" : ")[1]);

            if (actionOnOrder == "Edit Order") {
                deleteMessages(bot, ctx, 0).then(() => {
                    editOrderPage(ctx, orderId);
                });
            } else if (actionOnOrder == "Cancel Order") {
                deleteMessages(bot, ctx, 0).then(() => {
                    cancelOrderPage(ctx, orderId);
                });
            }

            break;

        case "placeSmartOrderPage":
        case "editOrderPage":
            {
                // remove first line of text
                let orderString = text.split("↓↓↓↓↓↓↓↓")[1];

                let orderObject = detectAndParseOrderString(orderString);
                let parsedOrderString = convertOrderToString(orderObject);

                confirmOrderPage(ctx, parsedOrderString, tempDb.page);
            }
            break;
        case "settingsPage":
            let settingsString = text.split("↓↓↓↓↓↓↓↓")[1];

            // ...TODO

            confirmSettingsPage(ctx, settingsString);
            break;
        default:
            break;
    }
});

function sendStartMessage(ctx: Context) {
    menuPage(ctx);
}

bot.command("start", ctx => {
    sendStartMessage(ctx);
});

// handle all errors
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

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



