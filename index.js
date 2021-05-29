const api = require('./api');

setInterval(async () => {

    console.log(await api.time());

}, process.env.CRAWLER_INTERVAL);