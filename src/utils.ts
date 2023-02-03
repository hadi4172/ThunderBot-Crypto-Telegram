const parseDetailedOrderString = orderString => {
    const lines = orderString.split("\n");
    const currencyPair = lines[0].slice(1).trim();
    const orderType = lines[1].trim().split(" ")[0];

    const getPrices = (lines, startIndex, endIndex) => {
        const completed: Number[] = [];
        const canceled: Number[] = [];
        const open: Number[] = [];
        lines
            .slice(startIndex, endIndex)
            .filter(line => line.includes(":"))
            .forEach(line => {
                const splitLine = line.split(":");
                const price = parseFloat(splitLine[1].trim().split(" ")[0]);
                if (splitLine[1].includes("✅")) {
                    completed.push(price);
                } else if (splitLine[1].includes("❌")) {
                    canceled.push(price);
                } else {
                    open.push(price);
                }
            });
        return { open, completed, canceled };
    };

    const pricesIndex = lines.findIndex(l => l.includes("BUY"));
    const takeProfitIndex = lines.findIndex(l => l.includes("TP"));
    const stopLossIndex = lines.findIndex(l => l.includes("SL"));

    const prices = getPrices(lines, pricesIndex, takeProfitIndex);
    const tpPrices = getPrices(lines, takeProfitIndex + 1, stopLossIndex);
    const slPrices = getPrices(lines, stopLossIndex, lines.length);

    return {
        currency_pair: currencyPair,
        order_type: orderType,
        prices: prices,
        tp_prices: tpPrices,
        sl_prices: slPrices,
    };
};

function removeEmptyLines(str) {
    return str
        .split("\n")
        .filter(line => line.trim() !== "")
        .join("\n");
}

const parseAbridgedOrderString = orderString => {
    const lines = orderString.split("\n").map(l => l.trim());
    const currency_pair = lines[0].substring(1);
    const order_type = lines[1].split(" ")[0];
    const prices = lines[1]
        .split(" ")
        .slice(1)
        .filter(p => p !== "-")
        .map(p => parseFloat(p));
    const tp_prices = lines[2]
        .split(" ")
        .slice(1)
        .map(p => parseFloat(p));
    const sl_prices = [parseFloat(lines[3].split(" ").slice(1))];

    return {
        currency_pair,
        order_type,
        prices: {
            open: prices,
            completed: [],
            canceled: [],
        },
        tp_prices: {
            open: tp_prices,
            completed: [],
            canceled: [],
        },
        sl_prices: {
            open: sl_prices,
            completed: [],
            canceled: [],
        },
    };
};

const detectAndParseOrderString = orderString => {
    orderString = removeEmptyLines(orderString);
    let order;
    if (orderString.split("\n").length === 4) {
        order = parseAbridgedOrderString(orderString);
    } else {
        order = parseDetailedOrderString(orderString);
    }
    // sort arrays by price
    const priceTypes = ["prices", "tp_prices", "sl_prices"];
    priceTypes.forEach(priceType => {
        order[priceType].open.sort((a, b) => a - b);
        order[priceType].completed.sort((a, b) => a - b);
        order[priceType].canceled.sort((a, b) => a - b);
    });

    return order;
};

function convertOrderToString(order) {
    let orderString = `#${order.currency_pair}\n${order.order_type}\n`;
    let priceCounter = 1;
    const priceTypes = [
        { name: "prices", prefix: "" },
        { name: "tp_prices", prefix: "TP\n" },
        { name: "sl_prices", prefix: "SL\n" },
    ];
    priceTypes.forEach((priceType, typeIndex) => {
        orderString += priceType.prefix;
        const statuses = ["completed", "canceled", "open"];
        statuses.forEach(status => {
            order[priceType.name][status].forEach(price => {
                orderString += `${priceCounter}: ${price} ${
                    status === "completed"
                        ? "✅COMPLETED"
                        : status === "canceled"
                        ? "❌CANCELED"
                        : ""
                }\n`;
                priceCounter++;
            });
        });
        if (typeIndex !== priceTypes.length - 1) {
            orderString += "\n";
            priceCounter = 1;
        }
    });
    return orderString;
}

async function deleteMessages(bot, ctx, numberOfMessages) {
    if (numberOfMessages === 0) return;

    let id = (await bot.telegram.sendMessage(ctx.chat.id, "Clearing console")).message_id;
    console.log(id);
    for (let i = 0; i <= numberOfMessages; i++) {
        try {
            ctx.deleteMessage(id - i);
        } catch (error) {
            console.log(error);
            break;
        }
    }
}

export { detectAndParseOrderString, convertOrderToString, deleteMessages };
