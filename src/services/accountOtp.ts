import { StatusCodes } from "http-status-codes";
import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { AccountOtp } from "../entities/accountOtp";
import { OtpEnum } from "../utils/app.enum";
import Result from "../utils/result";

const accountOtpRepository: Repository<AccountOtp> = AppDataSource.getRepository(AccountOtp);

export default class AccountOptService {
    static async getAccountOtp(accountId: number, type: OtpEnum, otp: string) {
        //Get user otp from the database
        let accountOtp: AccountOtp | null = await accountOtpRepository.findOne({
            relations: {
                account: true,
            },
            where: {
                account: {
                    id: accountId,
                },
                type: type,
                otp: otp,
            },
        });
        if (accountOtp !== null) {
            //Send confirm code to user email
            return new Result(StatusCodes.OK, 'OTP was right', accountOtp);
        } else
            return new Result(StatusCodes.BAD_REQUEST, 'OTP was not right!');
    }

    static async postAccountOtp(
        account: Account,
        type: OtpEnum,
        otp: string,
        otpExpiration: Date
    ) {
        //Get user otp from the database
        await accountOtpRepository.save({
            account: account,
            type: type,
            otp: otp,
            otpExpiration: otpExpiration,
        });
    }

    static async deleteAccountOtp(accountId: number, type: OtpEnum, otp: string) {
        //Get user otp from the database
        let accountOtp: AccountOtp | null = await accountOtpRepository.findOne({
            relations: {
                account: true,
            },
            where: {
                account: {
                    id: accountId,
                },
                type: type,
                otp: otp,
            },
        });
        if (accountOtp !== null) {
            //Send confirm code to user email
            accountOtpRepository.remove(accountOtp);
            return new Result(
                StatusCodes.OK,
                'Delete OTP successfully',
                accountOtp
            );
        } else
            return new Result(StatusCodes.BAD_REQUEST, 'OTP was not right!');
    }
}