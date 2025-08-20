const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.status(200).send('Hello, Nizam!');
})

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});