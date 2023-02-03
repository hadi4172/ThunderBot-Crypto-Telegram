import { Context } from "telegraf";
import { bot, tempDb } from "../telegram.bot";
import config from "../../config";


export function authenticationPage(ctx: Context) {
    // - Shows a message to enter the account name, the API Key and the secret key, if success, go to Menu, otherwise ask to enter again
    // the entry is in the input bar

    tempDb.page = "authenticationPage";

    let message = "Please enter the required informations to create the bot";
    // use switch_inline_query_current_chat of InlineKeyboardButton to put some text into the user's message input box
    bot.telegram.sendMessage(ctx.chat!.id, message, {
        reply_markup: {
            force_reply: true,
            input_field_placeholder: "Reply with your answer",
            inline_keyboard: [
                [
                    {
                        text: "Create bot",
                        // callback_data: "create_bot",
                        switch_inline_query_current_chat:
                            "↓↓↓↓↓↓↓↓\n" +
                            "Account Name : Hadi_Test_Bot_1" +
                            `\nAPI Key : ${config.binanceApiKey}` +
                            `\nSecret Key : ${config.binanceSecretKey}`,
                    },
                ],
            ],
        },
    });
}