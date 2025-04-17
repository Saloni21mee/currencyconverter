const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = '070669c9a4426fe87838ff08'; 
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;


app.use(express.static('public'));


app.get('/api/exchange-rate', async (req, res) => {
    const { from, to } = req.query;  // Get 'from' and 'to' currencies from the query parameters

    // Ensure both 'from' and 'to' currencies are provided
    if (!from || !to) {
        return res.status(400).json({ error: 'Both "from" and "to" currencies are required.' });
    }

    try {
        console.log(`Fetching exchange rate from ${from} to ${to}`);

        const response = await axios.get(`${API_URL}${from}`);

        console.log('Exchange rate data:', response.data);

        const rate = response.data.conversion_rates[to];

        if (!rate) {
            return res.status(400).json({ error: `No exchange rate data available for ${to}` });
        }

        res.json({ rate });
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        res.status(500).json({ error: 'Failed to fetch exchange rate data from external API.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
