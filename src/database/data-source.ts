import {DataSource} from 'typeorm';
import 'dotenv/config';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT_OUTSIDE),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/database/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
})