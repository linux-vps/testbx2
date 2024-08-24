import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, API_URL } from './config/config.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// log requests ra
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// assets tĩnh
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/dist', express.static(path.join(__dirname, './dist')));

app.get('/', (req, res) => {
    res.render('index', { API_URL: API_URL });
});
app.get('/getoauth2', (req, res) => {
  res.send("hello");
});
app.post('/install', (req, res) => {
  const { DOMAIN, PROTOCOL, LANG, APP_SID } = req.query;

  const currentTime = new Date().toLocaleString();
  console.log(`App installed at ${currentTime}`);
  console.log(`DOMAIN: ${DOMAIN}`);
  console.log(`PROTOCOL: ${PROTOCOL}`);
  console.log(`LANG: ${LANG}`);
  console.log(`APP_SID: ${APP_SID}`);

  res.render('index', {
    API_URL: API_URL || null,
    domain: DOMAIN || null,
    protocol: PROTOCOL || null,
    lang: LANG || null,
    appSid: APP_SID || null
  });
});



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
   