const express = require('express');
const app = express();
const testRoutes = require('./routes/testRoute');
const transactionRoutes = require('./routes/transactionRoute');
const productsRoutes = require('./routes/productsRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.get('/healthcheck', (req, res) => res.send('Server is running.'));
app.use('/test', testRoutes);
app.use('/transactions', transactionRoutes);
app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
module.exports = app;