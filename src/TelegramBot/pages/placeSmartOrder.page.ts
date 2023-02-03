import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "../telegram.bot";

export function placeSmartOrderPage(ctx: Context) {
    // - Shows text : Paste order string, with a link pointing to a webpage for example of usage
    // - Behavior : The user paste the string and enter, the program parse the string and open to confirmation page, or tell the user the string is not well formatted
    // - Button : Back to menu

    tempDb.page = ("placeSmartOrderPage");
    let message = `
<b>.:: Create Smart Order ::.</b>

Click on the create Button and paste the order string below, for example :

@${ctx.botInfo.username} ↓↓↓↓↓↓↓↓
#RUNEUSDT 
BUY 1.841 - 1.790 
TP 1.97 2.100 2.400 2.800 
SL 1.70

<a href="">Link on How to create an order string</a>
`;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            force_reply: true,
            input_field_placeholder: "Reply with your answer",
            inline_keyboard: [
                [
                    {
                        text: "Create",
                        switch_inline_query_current_chat:
                            "↓↓↓↓↓↓↓↓\n" + "#PAIR_HERE" + "\nBUY " + "\nTP " + "\nSL ",
                    },
                    { text: "Back to menu", callback_data: "menu" },
                ],
            ],
        },
    });
}


bot.action("place_smart_order", ctx => {
    ctx.deleteMessage();
    placeSmartOrderPage(ctx);
});