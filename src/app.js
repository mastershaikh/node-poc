const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDb().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});