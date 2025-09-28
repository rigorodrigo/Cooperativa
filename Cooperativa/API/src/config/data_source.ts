import { Cliente } from '@entities/Cliente';
import { Cultura } from '@entities/Cultura';
import { Saca } from '@entities/Saca';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv'

dotenv.config();

export const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port:  Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Cliente,Cultura, Saca],
    migrations: ['src/migrations/*.ts'],
});