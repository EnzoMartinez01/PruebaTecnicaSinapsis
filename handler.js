const serverless = require('serverless-http');
const express = require('express');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
app.use(express.json());

app.use('/campaigns', campaignRoutes);
app.use('/auth', require('./routes/customerRoutes'));

if (process.env.NODE_ENV !== 'serverless') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports.server = serverless(app);