const express = require('express');
const app = express();

app.use(express.json());

app.get('/healthcheck', (req, res) => res.send('Server is running.'));


module.exports = app;
