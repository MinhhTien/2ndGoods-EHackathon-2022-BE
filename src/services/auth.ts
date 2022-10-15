import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { StatusEnum } from "../utils/app.enum";
import { StatusCodes } from 'http-status-codes';
import Response from '../utils/result';
import jwt from 'jsonwebtoken';
import config from '../utils/app.config';

const accountRepository: Repository<Account> = AppDataSource.getRepository(Account);

export default class AuthService { 
    static async login(
        email: string,
        password: string
      ) {
        //Get user from database
        var account: Account | null = await accountRepository.findOne({
            where: {
              email: email,
              status: StatusEnum.ACTIVE,
            },
          });
      
        if (account !== null) {
          //Check if encrypted password match
          if (!account.checkIfUnencryptedPasswordIsValid(password)) {
            return new Response(
                StatusCodes.UNAUTHORIZED,
              'Wrong Password!'
            );
          }
          //Sign JWT, valid for 1 hour
          const token = jwt.sign(
            { userId: account.id, email: account.email },
            config.JWT_SECRET,
            { expiresIn: '1h' }
          );
          return new Response(StatusCodes.OK, 'Login successfully', token);
        } else
          return new Response(
            StatusCodes.BAD_REQUEST,
            'Wrong Email!'
          );
      }
}