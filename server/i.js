import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.json());

app.post('/', (req, res) => {
    res.send("Hello Bitrix24");
});

app.post('/install', (req, res) => {
  const currentTime = new Date().toLocaleString();
  console.log(`App installed at ${currentTime}`);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
