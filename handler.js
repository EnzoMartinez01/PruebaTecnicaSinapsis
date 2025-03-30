const serverless = require('serverless-http');
const express = require('express');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
app.use(express.json());

app.use('/campaigns', campaignRoutes);
app.use('/auth', require('./routes/customerRoutes'));

module.exports.server = serverless(app);