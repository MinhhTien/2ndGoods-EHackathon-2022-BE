import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { OtpEnum, StatusEnum } from "../utils/app.enum";
import { StatusCodes } from 'http-status-codes';
import Result from '../utils/result';
import jwt from 'jsonwebtoken';
import config from '../utils/app.config';
import { AccountOtp } from "../entities/accountOtp";
import AccountOptService from "./accountOtp";

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
        return new Result(
          StatusCodes.UNAUTHORIZED,
          'Wrong Password!'
        );
      }
      //Sign JWT, valid for 1 hour
      const token = jwt.sign(
        { accountId: account.id, email: account.email },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return new Result(StatusCodes.OK, 'Login successfully', token);
    } else
      return new Result(
        StatusCodes.BAD_REQUEST,
        'Wrong Email!'
      );
  }

  static async resetPassword(id: number, password: string) {
    //Get user from the database
    let account: Account | null = await accountRepository.findOne({
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      },
    });
    if (account !== null) {
      //Validate the model (password lenght)
      account.password = password;
      //Hash the new password and save
      account.hashPassword();
      accountRepository.save(account);

      return new Result(StatusCodes.OK, 'Change password successfully!');
    } else
      return new Result(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized error, user not exist!'
      );
  }

  static async verifyOtp(email: string, otp: string, type: OtpEnum) {
    //VERIFY GENERATED OTP
    let result = await AccountOptService.getAccountOtp(email, type, otp);
    if (result.getCode() == StatusCodes.OK) {
      let existOtp: AccountOtp = result.getData();
      const currentDate = new Date();
      if (existOtp.otpExpiration > currentDate) {
        return new Result(StatusCodes.OK, 'Verify OTP successfully!');
      }
      await AccountOptService.deleteAccountOtp(email, OtpEnum.VERIFICATION, otp);
      return new Result(StatusCodes.UNAUTHORIZED, 'OTP was expired!');
    } else {
      return new Result(StatusCodes.BAD_REQUEST, 'OTP was not right!');
    }
  }

}