import { Request, Response } from 'express';
import { ControllerService } from "../utils/decorators";
import { StatusCodes } from 'http-status-codes';
import AuthService from "../services/auth";

export default class AuthController { 
    @ControllerService({
        body: [
          {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
              const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
              if (!emailRegExp.test(value))
                  return `Email must be valid.`;
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
}