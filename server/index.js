// ./index.js

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { PORT } from './config/config.js';
import {errorHandler}  from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// log requests ra
app.use(morgan('dev'));

app.post('/install', (req, res) => {
    const { DOMAIN, PROTOCOL, LANG, APP_SID } = req.query;
  
    const currentTime = new Date().toLocaleString();
    console.log(`App installed at ${currentTime}`);
    console.log(`DOMAIN: ${DOMAIN}`);
    console.log(`PROTOCOL: ${PROTOCOL}`);
    console.log(`LANG: ${LANG}`);
    console.log(`APP_SID: ${APP_SID}`);
  });

app.use('/api', apiRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
});
