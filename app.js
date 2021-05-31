const express = require('express');

const app = express();

app.use('/',(req, res) => {
    console.log('Entrou!');
    res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
    console.log('App rodando!');
});