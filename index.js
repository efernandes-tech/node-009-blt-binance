const api = require('./api');
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);
const coin = process.env.COIN;
const goodBuy = process.env.GOOD_BUY;
const goodSell = process.env.GOOD_SELL;

setInterval(async () => {

    // console.log(await api.exchangeInfo());

    // console.log(await api.time());
    // console.log(await api.depth(symbol));

    let buy = 0, sell = 0;

    const result = await api.depth(symbol);

    if (result.bids && result.bids.length) {
        buy = parseFloat(result.bids[0][0]);

        console.log(`Highest Buy: ${result.bids[0][0]}`);
    }
    if (result.asks && result.asks.length) {
        sell = parseFloat(result.asks[0][0]);

        console.log(`Lowest Sell: ${result.asks[0][0]}`);
    }

    if (sell && sell < goodBuy) {
        console.log('Time to BUY !!!');

        // console.log(await api.accountInfo());

        const account = await api.accountInfo();
        const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
        console.log('Portfolio position:');
        console.log(coins);

        console.log('Checking for Money!');
        const walletCoin = parseFloat(coins.find(c => c.asset === coin).free);
        const qty = parseFloat((walletCoin / sell) - 0.00001).toFixed(5);
        console.log(`qty: ${qty}`)

        if (sell <= walletCoin) {
            console.log('Have money!');

            const buyOrder = await api.newOrder(symbol, qty);

            console.log(`orderId: ${buyOrder.orderId}`);
            console.log(`status: ${buyOrder.status}`);

            if (buyOrder.status === 'FILLED') {
                console.log('Positioning future sale!');

                const price = parseFloat(sell * profitability).toFixed(5);
                console.log(`Selling for: ${price} (${profitability})`);

                const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');

                console.log(`orderId: ${sellOrder.orderId}`);
                console.log(`status: ${sellOrder.status}`);
            }
        }
    }
    else if (buy && buy > goodSell) {
        console.log('Time to SELL !!!');
    }
    else {
        console.log('Waiting for the market to move!');
    }

}, process.env.CRAWLER_INTERVAL);