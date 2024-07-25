const express = require('express');
const app = express();
const testRoutes = require('./routes/testRoute');
const productsRoutes = require('./routes/productsRoutes');

app.use(express.json());

app.get('/healthcheck', (req, res) => res.send('Server is running.'));
app.use('/test', testRoutes);
app.use('/products', productsRoutes);
module.exports = app;