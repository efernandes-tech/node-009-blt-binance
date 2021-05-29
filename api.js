const axios = require('axios');
const queryString = require('querystring');

async function publicCall(path, data, method = 'GET') {
    try {
        const qs = data ? `?${queryString.stringify(data)}` : '';

        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        })

        return result.data;
    } catch (err) {
        console.log(err);
    }
}

async function time() {
    return publicCall('/v3/time');
}

module.exports = { time }