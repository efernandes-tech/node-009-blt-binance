const api = require('./api');
const symbol = process.env.SYMBOL;

setInterval(async () => {

    // console.log(await api.exchangeInfo());

    // console.log(await api.time());
    // console.log(await api.depth(symbol));

    let buy = 0, sell = 0;

    const result = await api.depth(symbol);

    if (result.bids && result.bids.length) {
        buy = parseInt(result.bids[0][0]);

        console.log(`Highest Buy: ${result.bids[0][0]}`);
    }
    if (result.asks && result.asks.length) {
        sell = parseInt(result.asks[0][0]);

        console.log(`Lowest Sell: ${result.asks[0][0]}`);
    }

    if (sell < 200000) {
        console.log('Time to BUY !!!');

        // console.log(await api.accountInfo());

        const account = await api.accountInfo();
        const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
        console.log('Portfolio position:');
        console.log(coins);
    }
    else if (buy > 230000) {
        console.log('Time to SELL !!!');
    }
    else {
        console.log('Waiting for the market to move!');
    }

}, process.env.CRAWLER_INTERVAL);