import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "../telegram.bot";
import { menuPage } from "../exporters/pageExporter";

export function confirmOrderPage(ctx: Context, orderString: string, lastPage: string) {
    tempDb.page = (`confirmOrder-${lastPage}`);

    let message = `Confirm that the string was parsed correctly\n---------------------\n${orderString}`;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Confirm", callback_data: "confirm_order" },
                    {
                        text: "Cancel",
                        callback_data: (() => {
                            if (lastPage == "placeSmartOrderPage") return "place_smart_order";
                            else if (lastPage == "editOrderPage") return "menu"; //NOTE: maybe change to edit_order
                            else return "error";    //TODO handle error
                        })(),
                    },
                ],
            ],
        },
    });
}

bot.action("confirm_order", ctx => {
    let lastPage = tempDb.page.split("-")[1];
    switch (lastPage) {
        case "placeSmartOrderPage":
            ctx.sendMessage("Order placed successfully");
            menuPage(ctx);
            break;
        case "editOrderPage":
            ctx.sendMessage("Order edited successfully");
            menuPage(ctx);
            break;
        default:
            break;
    }
});