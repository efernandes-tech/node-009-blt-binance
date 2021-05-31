const express = require('express');

const app = express();
const path = require('path');
const api = require('./api');
const symbol = process.env.SYMBOL;
const coin = process.env.COIN;
const profitability = process.env.PROFITABILITY;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/data', async (req, res) => {

    const data = {};

    const market = await api.depth(symbol);
    data.buy = market.bids.length ? market.bids[0][0] : 0;
    data.sell = market.asks.length ? market.asks[0][0] : 0;

    const wallet = await api.accountInfo();
    const coins = wallet.balances.filter(b => symbol.indexOf(b.asset !== -1));
    data.coins = coins;

    const sellPrice = parseFloat(data.sell);

    const walletCoin = parseFloat(coins.find(c => c.asset.endsWith(coin)).free);

    if (sellPrice < 1000) {
        const qty = 1; //parseFloat((walletCoin / sellPrice) - 0.00001).toFixed(5);

        if (sellPrice <= walletCoin) {
            const buyOrder = await api.newOrder(symbol, qty);
            data.buyOrder = buyOrder;

            if (buyOrder.status === 'FILLED') {
                const price = parseFloat(sellPrice * profitability).toFixed(5);

                const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
                data.sellOrder = sellOrder;
            }
        }
    }

    res.json(data);

});

app.use('/',(req, res) => {
    console.log('Entrou!');
    res.render('app', {
        symbol: symbol,
        profitability: profitability,
        lastUpdate: new Date(),
        interval: parseInt(process.env.CRAWLER_INTERVAL)
    });
});

app.listen(process.env.PORT, () => {
    console.log('App rodando!');
});