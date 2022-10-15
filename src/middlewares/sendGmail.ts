import nodemailer from 'nodemailer';
import config from '../utils/app.config';

export default class SendGmailMiddleware {
  private static instance: SendGmailMiddleware;
  private transporter: nodemailer.Transporter;

  private constructor() {}

  //INSTANCE CREATE FOR MAIL
  static getInstance() {
    if (!SendGmailMiddleware.instance) {
      SendGmailMiddleware.instance = new SendGmailMiddleware();
    }
    return SendGmailMiddleware.instance;
  }

  //CREATE A CONNECTION FOR LIVE
  async createConnection() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.SMTP_USERNAME,
        pass: config.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  //SEND MAIL
  async sendMail(mailOptions: object, callback: any) {
    return await this.transporter.sendMail(mailOptions, callback);
  }

  //VERIFY CONNECTION
  async verifyConnection() {
    return this.transporter.verify();
  }

  //CREATE TRANSPORTER
  getTransporter() {
    return this.transporter;
  }
}
