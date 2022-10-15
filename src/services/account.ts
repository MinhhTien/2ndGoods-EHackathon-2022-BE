import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { StatusEnum } from "../utils/app.enum";
import { StatusCodes } from 'http-status-codes';
import Result from '../utils/result';

const accountRepository: Repository<Account> = AppDataSource.getRepository(Account);

export default class AccountService {
  static async getOneById(accountId: number): Promise<Account | null> {
    const account = await accountRepository.findOne({
      relations: {
        avatar: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true
      },
      where: {
        id: accountId,
        status: StatusEnum.ACTIVE,
      },
    });
    return account ? account : null;
  }
  static async getOneByEmail(email: string): Promise<Account | null> {
    const account = await accountRepository.findOne({
      relations: {
        avatar: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true
      },
      where: {
        email: email,
        status: StatusEnum.ACTIVE,
      },
    });
    return account ? account : null;
  }
  static async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ) {
    //Get user from the database
    let account: Account | null = await accountRepository.findOne({
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      },
    });
    if (account !== null) {
      //Check if old password matchs
      if (!account.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        return new Result(StatusCodes.BAD_REQUEST, 'Wrong password!');
      }
      //Validate the model (password lenght)
      account.password = newPassword;
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
  static async postNew(
    name: string,
    email: string,
    password: string
  ) {
    const emailAccount: Account | null = await accountRepository.findOne({
      where: {
        email: email,
        status: StatusEnum.ACTIVE,
      },
    });
    if (emailAccount != null) {
      return new Result(StatusCodes.BAD_REQUEST, 'Email already existed!');
    }

    //Get parameters from the body
    let account = new Account();
    account.name = name;
    account.email = email;
    account.password = password;
    account.hashPassword();

    await accountRepository.save(account);

    return new Result(
      StatusCodes.CREATED,
      'Create new user successfully!'
    );
  }
  static async delete(accountId: number) {
    const account: Account | null = await accountRepository.findOne({
      where: {
        id: accountId,
        status: StatusEnum.ACTIVE,
      },
    });
    if (account == null) {
      return new Result(StatusCodes.BAD_REQUEST, 'Account not exist.');
    }

    const result = await accountRepository.update(
      {
        id: accountId,
        status: StatusEnum.ACTIVE,
      },
      { status: StatusEnum.INACTIVE }
    );
    if (result.affected == 1) {
      return new Result(StatusCodes.OK, 'Delete account successfully!');
    } else {
      return new Result(StatusCodes.BAD_REQUEST, 'Delete account failed!');
    }
  }
}