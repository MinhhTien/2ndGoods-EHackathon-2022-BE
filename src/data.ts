import { AdvancedConsoleLogger, DataSource } from 'typeorm';
import * as path from 'path';
import Config from './utils/app.config';
console.log({
  type: 'mysql',
  port: Config.DATABASE_PORT,
  host: Config.DATABASE_HOST,
  username: Config.DATABASE_USERNAME,
  password: Config.DATABASE_PASSWORD,
  database: Config.DATABASE_NAME,
  entities: [path.resolve(__dirname + '/entities/*{.js,.ts}')],
  logging: true,
  logger: new AdvancedConsoleLogger('all'),
})
export const AppDataSource = new DataSource({
    type: 'mysql',
    port: Config.DATABASE_PORT,
    host: Config.DATABASE_HOST,
    username: Config.DATABASE_USERNAME,
    password: Config.DATABASE_PASSWORD,
    database: Config.DATABASE_NAME,
    entities: [path.resolve(__dirname + '/entities/*{.js,.ts}')],
    synchronize: true,
    logging: true,
    logger: new AdvancedConsoleLogger('all'),
  });
