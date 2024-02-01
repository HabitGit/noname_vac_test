import { DataSource } from 'typeorm';
import 'dotenv/config';

export const dataSource2 = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST2,
  port: Number(process.env.POSTGRES_PORT_OUTSIDE2),
  username: process.env.POSTGRES_USER2,
  password: process.env.POSTGRES_PASSWORD2,
  database: process.env.POSTGRES_DB2,
  entities: ['src/database/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
