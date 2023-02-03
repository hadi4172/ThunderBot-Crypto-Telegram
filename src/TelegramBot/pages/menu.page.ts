import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "../telegram.bot";

export function menuPage(ctx: Context) {
    // - Shows current opened orders with % profit, total value, and number of days opened
    // - Button : Update informations
    // - Button : Place smart order
    // - Button : Edit order
    // - Button : Cancel order
    // - Button : Settings

    tempDb.page = ("menuPage");

    let message = `
<b>.:: Menu ::.</b>
${userInfos.accountName}

Total value : 0.0000
Total profit : 0.0000
Total profit % : 0.0000

<b>Orders</b><code>
------------------------------------------------------
ID  |   Pair     | Value     | PnL $ | PnL % | Days
------------------------------------------------------
1   |🟩BTCUSDT  | 0.0000000 | 0.000 | 0.000 | 0
2   |🟩ETHUSDT  | 0.0000000 | 0.000 | 0.000 | 0
3   |🟥BNBUSDT  | 0.0000000 | 0.000 | 0.000 | 0
4   |🟥ADAUSDT  | 0.0000000 | 0.000 | 0.000 | 0
5   |🟩DOTUSDT  | 0.0000000 | 0.000 | 0.000 | 0
6   |🟥XRPUSDT  | 0.0000000 | 0.000 | 0.000 | 0
</code>
`;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Update informations", callback_data: "update_informations" },
                    { text: "Place smart order", callback_data: "place_smart_order" },
                ],
                [
                    {
                        text: "Edit order",
                        switch_inline_query_current_chat:
                            "↓↓↓↓↓↓↓↓\n" + "Edit Order : WRITE_ORDER_ID_HERE",
                    },
                    {
                        text: "Cancel order",
                        switch_inline_query_current_chat:
                            "↓↓↓↓↓↓↓↓\n" + "Cancel Order : WRITE_ORDER_ID_HERE",
                    },
                ],
                [{ text: "Settings", callback_data: "settings" }],
            ],
        },
    });
}

bot.action("update_informations", ctx => {
    ctx.deleteMessage();
    menuPage(ctx);
});

bot.action("menu", ctx => {
    ctx.deleteMessage();
    menuPage(ctx);
});