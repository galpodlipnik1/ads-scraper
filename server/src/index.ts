import express from 'express';
import cors from 'cors';
import { scrapeSite, saveScrapes, getScrapes, createTableIfNotExists } from './fnc.js';

const app = express();
const port = 5000;
app.use(cors({ origin: '*' }));


await createTableIfNotExists();

app.get('/appartments', async (req, res) => {
  
  const page = parseInt(req.query.page as string);
  
  if (isNaN(page)) {
    return res.status(400).json({ error: 'Invalid page parameter' });
  }
  
  try {
    const data = await getScrapes(page);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const resData = await scrapeSite();
await saveScrapes(resData);

