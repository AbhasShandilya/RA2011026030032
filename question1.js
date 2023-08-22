const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  const promises = [];

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  urls.forEach(url => {
    promises.push(
      axios.get(url).catch(error => {
        console.error(`Error fetching data from ${url}: ${error.message}`);
        return { data: { numbers: [] } }; // Empty data if fetching fails
      })
    );
  });

  try {
    const responses = await Promise.all(promises);
    const allNumbers = responses.reduce((acc, response) => {
      if (response && response.data && Array.isArray(response.data.numbers)) {
        acc.push(...response.data.numbers);
      }
      return acc;
    }, []);

    const uniqueNumbers = [...new Set(allNumbers)];
    const sortedNumbers = uniqueNumbers.sort((a, b) => a - b);

    return res.json({ numbers: sortedNumbers });
  } catch (error) {
    console.error(`Error processing responses: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
