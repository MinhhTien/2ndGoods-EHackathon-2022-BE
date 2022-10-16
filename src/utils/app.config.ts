import { config } from 'dotenv';

config();

export default class Config {
  static PORT = parseInt(process.env.PORT || '8080');
  static DATABASE_PORT = parseInt(process.env.DATABASE_PORT || '3306');
  static DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1';
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'root';
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '300618';
  static DATABASE_NAME = process.env.DATABASE_NAME || '2ndgoods';
  static JWT_SECRET = process.env.JWT_SECRET || '@QEGTUI';
  static IMAGE_PATH = process.env.IMAGE_PATH || 'public/uploads/';
  static SMTP_USERNAME = process.env.SMTP_USERNAME;
  static SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  static SMTP_SENDER = process.env.SMTP_SENDER;
  static FILE_SIZE = parseInt(process.env.FILE_SIZE || '100');
}