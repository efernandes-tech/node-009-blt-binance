const api = require('./api');

setInterval(async () => {

    // console.log(await api.time());
    // console.log(await api.depth());

    const result = await api.depth();

    console.log(`Highest Buy: ${result.bids[0][0]}`);
    console.log(`Lowest Sell: ${result.asks[0][0]}`);

    const buy = parseInt(result.bids[0][0]);
    const sell = parseInt(result.asks[0][0]);

    if (sell < 200000) {
        console.log('Time to BUY !!!');
    }
    else if (buy > 230000) {
        console.log('Time to SELL !!!');
    }
    else {
        console.log('Waiting for the market to move!');
    }

}, process.env.CRAWLER_INTERVAL);