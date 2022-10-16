import { Request, Response } from 'express';
import { ControllerService } from "../utils/decorators";
import { StatusCodes } from 'http-status-codes';
import AuthService from "../services/auth";
import AccountService from '../services/account';
import { generateCode } from '../utils';
import config from '../utils/app.config';
import SendGmailMiddleware from '../middlewares/sendGmail';
import { OtpEnum } from '../utils/app.enum';
import htmlTemplate from '../utils/templates/htmlTemplate';
import AccountOptService from '../services/accountOtp';

export default class AuthController { 
    @ControllerService({
        body: [
          {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
              const emailRegExp: RegExp = /^[\w\.-]+@fpt.edu.vn$/;
              if (!emailRegExp.test(value))
                  return `Please login email @fpt.edu.vn!`;
              return null;
            },
          },
          {
            name: 'password',
            type: String,
            validator: (propName: string, value: string) => {
              const pwdRegExp: RegExp =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
              if (!pwdRegExp.test(value))
                return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
              return null;
            },
          },
        ],
      })
      static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await AuthService.login(
          email.toLowerCase(),
          password,
        );
        if (result.getCode() === StatusCodes.OK) {
          //Send the jwt in the response
          res
            .status(result.getCode())
            .send({ message: result.getMessage(), token: result.getData() });
        } else {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
      @ControllerService({
        body: [
          {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
              const emailRegExp: RegExp = /^[\w\.-]+@fpt.edu.vn$/;
              if (!emailRegExp.test(value))
                  return `Please login email @fpt.edu.vn!`;
              return null;
            },
          },
        ],
      })
      static async sendGmailForForgotPassword(req: Request, res: Response) {
        //Get parameters from the body
        const data = req.body;
    
        const account = await AccountService.getOneByEmail(
          String(data.email).toLowerCase()
        );
        if (!account)
          res.status(StatusCodes.BAD_REQUEST).send({ message: 'Wrong email' });
        else {
          let tokenExpiration: Date = new Date();
          tokenExpiration.setMinutes(10 + tokenExpiration.getMinutes());
    
          const otp: string = generateCode(6);
    
          await AccountOptService.postAccountOtp(account, OtpEnum.FORGET, otp, tokenExpiration);
          let name = account.name;
    
          const emailTemplate = htmlTemplate.resetPassword(otp, name);
    
          const sendGmail = SendGmailMiddleware.getInstance();
          await sendGmail.createConnection();
          await sendGmail.sendMail(
            {
              from: config.SMTP_SENDER,
              to: account.email,
              subject: 'Reset password',
              text: 'Hello from 2ndGoods',
              html: emailTemplate.html,
            },
            function (err: any, success: any) {
              if (err) res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err: err });
              else
                res.status(StatusCodes.OK).send({
                  message:
                    'Reset Password OTP was sent via your email successfully',
                });
            }
          );
        }
      }
      @ControllerService({
        body: [
          {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
              const emailRegExp: RegExp = /^[\w\.-]+@fpt.edu.vn$/;
              if (!emailRegExp.test(value))
                  return `Please login email @fpt.edu.vn!`;
              return null;
            },
          },
        ],
      })
      static async sendGmailForVerifingEmail(req: Request, res: Response) {
        //Get parameters from the body
        const data = req.body;
    
        const account = await AccountService.getOneByEmail(
          String(data.email).toLowerCase()
        );
        if (!account)
          res.status(StatusCodes.BAD_REQUEST).send({ message: 'Wrong email' });
        else {
          let tokenExpiration: Date = new Date();
          tokenExpiration.setMinutes(10 + tokenExpiration.getMinutes());
    
          const otp: string = generateCode(6);
    
          await AccountOptService.postAccountOtp(account, OtpEnum.VERIFICATION, otp, tokenExpiration);
          let name = account.name;
    
          const emailTemplate = htmlTemplate.verifyEmail(otp, name);
    
          const sendGmail = SendGmailMiddleware.getInstance();
          await sendGmail.createConnection();
          await sendGmail.sendMail(
            {
              from: config.SMTP_SENDER,
              to: account.email,
              subject: 'Verify Your Login Email',
              text: 'Hello from 2ndGoods',
              html: emailTemplate.html,
            },
            function (err: any, success: any) {
              if (err) res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err: err });
              else
                res.status(StatusCodes.OK).send({
                  message:
                    'Verifing Email OTP was sent via your email successfully',
                });
            }
          );
        }
      }
    
      @ControllerService({
        body: [
          {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
              const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
              if (!emailRegExp.test(value))
                return `${propName} must be valid email`;
              return null;
            },
          },
          {
            name: 'otp',
            type: String,
            validator: (propName: string, value: string) => {
              const otpRegExp: RegExp = /^[0-9]{6}$/;
              if (!otpRegExp.test(value)) return `${propName} must be valid OTP`;
              return null;
            },
          },
        ],
      })
      static async verifyEmail(req: Request, res: Response) {
        const data = req.body;
        const account = await AccountService.getOneByEmail(
          String(data.email).toLowerCase()
        );
        if (!account)
          res.status(StatusCodes.BAD_REQUEST).send({ message: 'Wrong email' });
        else {
          const result = await AuthService.verifyOtp(
            account.id,
            data.otp,
            OtpEnum.VERIFICATION
          );
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
    
      @ControllerService({
        body: [
          {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
              const emailRegExp: RegExp = /^[\w\.-]+@fpt.edu.vn$/;
              if (!emailRegExp.test(value))
                  return `Please login email @fpt.edu.vn!`;
              return null;
            },
          },
          {
            name: 'otp',
            type: String,
            validator: (propName: string, value: string) => {
              const otpRegExp: RegExp = /^[0-9]{6}$/;
              if (!otpRegExp.test(value)) return `${propName} must be valid OTP`;
              return null;
            },
          },
          {
            name: 'password',
            type: String,
            validator: (propName: string, value: string) => {
              const pwdRegExp: RegExp =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
              if (!pwdRegExp.test(value))
                return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
              return null;
            },
          },
          {
            name: 'confirmPassword',
            type: String,
            validator: (propName: string, value: string) => {
              const pwdRegExp: RegExp =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
              if (!pwdRegExp.test(value))
                return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
              return null;
            },
          },
        ],
      })
      static async resetPassword(req: Request, res: Response) {
        const data = req.body;
        if (data.password !== data.confirmPassword)
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Wrong confirm password' });
    
        const user = await AccountService.getOneByEmail(
          String(data.email).toLowerCase()
        );
        if (!user)
          res.status(StatusCodes.BAD_REQUEST).send({ message: 'Wrong email' });
        else {
          const result = await AuthService.verifyOtp(
            user.id,
            data.otp,
            OtpEnum.FORGET
          );
          if (result.getCode() != StatusCodes.OK)
            res.status(result.getCode()).send({ message: result.getMessage() });
          else {
            const reset = await AuthService.resetPassword(user.id, data.password);
            if (reset.getCode() == StatusCodes.OK)
              await AccountOptService.deleteAccountOtp(user.id, OtpEnum.FORGET, data.otp);
            res.status(reset.getCode()).send({ message: reset.getMessage() });
          }
        }
      }
}