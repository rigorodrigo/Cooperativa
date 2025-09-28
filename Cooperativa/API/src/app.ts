import express from 'express';
import cors  from 'cors';
import { errorHandler } from '@middlewares/errorHandler';
import routes from '@routes/index';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (req,res) => res.json({status: 'ok', uptime: process.uptime()}));


app.use('/api', routes);
app.use(errorHandler);

export default app;