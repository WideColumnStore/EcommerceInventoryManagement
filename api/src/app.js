const express = require('express');
const app = express();
const testRoutes = require('./routes/testRoute');

app.use(express.json());

app.get('/healthcheck', (req, res) => res.send('Server is running.'));
app.use('/test', testRoutes);

module.exports = app;
