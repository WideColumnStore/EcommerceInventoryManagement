const express = require('express');
const app = express();
const testRoutes = require('./routes/testRoute');
const transactionRoutes = require('./routes/transactionRoute');

app.use(express.json());

app.get('/healthcheck', (req, res) => res.send('Server is running.'));
app.use('/test', testRoutes);
app.use('/transactions', transactionRoutes);

module.exports = app;
