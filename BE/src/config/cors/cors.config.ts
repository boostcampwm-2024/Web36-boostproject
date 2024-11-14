import dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

export const corsOptions = {
  origin: ['http://localhost:4173', process.env.HOST_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
