import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "../telegram.bot";
import { menuPage } from "../exporters/pageExporter";

export function cancelOrderPage(ctx: Context, orderId: number) {
    tempDb.page = ("cancelOrderPage");

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

    let message = `Are you sure you want to cancel order ${orderId} ?\n---------------------\n${orderString}`;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Yes", callback_data: "cancel_order" },
                    { text: "No", callback_data: "menu" },
                ],
            ],
        },
    });
}


bot.action("cancel_order", ctx => {
    ctx.sendMessage("Order canceled successfully");
    menuPage(ctx);
});