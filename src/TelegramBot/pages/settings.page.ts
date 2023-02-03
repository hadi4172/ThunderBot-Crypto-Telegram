import { Context } from "telegraf";
import { bot, tempDb, userInfos } from "../telegram.bot";
import { menuPage } from "../exporters/pageExporter";

export function confirmSettingsPage(ctx: Context, settingsString: string) {
    tempDb.page = ("confirmSettings");

    let message = `Confirm that the string was parsed correctly\n---------------------\n${settingsString}`;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Confirm", callback_data: "confirm_settings" },
                    { text: "Cancel", callback_data: "settings" },
                ],
            ],
        },
    });
}

export function settingsPage(ctx: Context) {
    tempDb.page = ("settingsPage");

    let settingsString = `TODO`;

    let message = `
    <b>.:: Settings ::.</b>
    
    ${settingsString}
    
    <a href="">Link for settings documentations</a>
    `;

    bot.telegram.sendMessage(ctx.chat!.id, message, {
        parse_mode: "HTML",
        reply_markup: {
            force_reply: true,
            input_field_placeholder: "Reply with your answer",
            inline_keyboard: [
                [
                    {
                        text: "Edit settings",
                        switch_inline_query_current_chat: "↓↓↓↓↓↓↓↓\n" + settingsString,
                    },
                    { text: "Back to menu", callback_data: "menu" },
                ],
            ],
        },
    });
}


bot.action("confirm_settings", ctx => {
    let lastPage = tempDb.page.split("-")[1];

    ctx.sendMessage("Settings updated successfully");
    menuPage(ctx);
});

bot.action("settings", ctx => {
    ctx.deleteMessage();
    settingsPage(ctx);
});