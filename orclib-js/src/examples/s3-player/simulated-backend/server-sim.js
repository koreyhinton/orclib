const express = require('express');
const path = require('path');
const indexSim = require('./index-sim');
const app = express(); // simulated backend app
const port = 3000;

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, '../../..')));

app.get('/', indexSim);

app.listen(port, () => {
    console.log(`Running simulated s3 backend on http://localhost:${port}/`);
});
