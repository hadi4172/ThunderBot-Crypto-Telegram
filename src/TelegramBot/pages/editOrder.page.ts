import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "../telegram.bot";


export function editOrderPage(ctx: Context, orderId: number) {
    tempDb.page = ("editOrderPage");

    let orderString = `#RUNEUSDT 
BUY 
1: 1.841 ✅COMPLETED
2: 1.790 ❌CANCELED

TP 
1: 1.97 ✅COMPLETED
2: 2.10 
3: 2.400 
4: 2.800 

SL 
1: 1.7`;

    let message = `Edit order ${orderId}\n--------------------- \n${orderString}`;

    let inlineQueryMessage = `↓↓↓↓↓↓↓↓\n${orderString}`;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            force_reply: true,
            input_field_placeholder:
                "Click on select the order infos button, then edit the order string and send it",
            inline_keyboard: [
                [
                    {
                        text: "Select the order infos",
                        switch_inline_query_current_chat: inlineQueryMessage,
                    },
                    { text: "Cancel", callback_data: "menu" },
                ],
            ],
        },
    });
}