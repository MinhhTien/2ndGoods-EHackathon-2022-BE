import { StatusCodes } from "http-status-codes";
import { MoreThan } from "typeorm";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { Voucher } from "../entities/voucher";
import Result from "../utils/result";

 const voucherRepository = AppDataSource.getRepository(Voucher);
export default class VoucherService {
    static async listAll() {
      const now = new Date();
      const vouchers = await voucherRepository.find({
        select: {
          id: true,
          title: true,
          amount: true,
          condition: true,
          mfgDate: true,
          expDate: true,
        },
        where: {
          mfgDate: MoreThan(now),
        },
      });
      return vouchers && vouchers.length > 0 ? vouchers : false;
    }
  
    static async getOneById(id: string) {
      const voucher = await voucherRepository.findOne({
        select: {
          title: true,
          amount: true,
          condition: true,
          mfgDate: true,
          expDate: true,
        },
        where: {
          id,
        },
      });
      return voucher ? voucher : false;
    }

    static async getAccountVoucher(id: string) {
        const voucher = await voucherRepository.findOne({
          select: {
            title: true,
            amount: true,
            condition: true,
            mfgDate: true,
            expDate: true,
          },
          where: {
            id,
          },
        });
        return voucher ? voucher : false;
      }
  
    static async newVoucher(
      account: Account,
      title: string,
      amount: number,
      condition: string,
      mfgDate: Date,
      expDate: Date
    ) {
      const voucher = await voucherRepository.save({
        title,
        createdBy: account,
        amount,
        condition,
        mfgDate,
        expDate,
      });
      if (voucher)
        return new Result(StatusCodes.OK, 'Create voucher successfully!', {
          voucher
        });
      return new Result(StatusCodes.BAD_REQUEST, 'Failed');
    }
  
    static async editVoucher(
      account: Account,
      id: string,
      title: string,
      amount: number,
      condition: string,
      mfgDate: Date,
      expDate: Date
    ) {
      const voucher = await voucherRepository.findOne({
        relations: {
          createdBy: true,
        },
        where: {
          id: id,
        },
      });
      if (voucher == null)
        return new Result(StatusCodes.BAD_REQUEST, 'Unavailable Voucher!');
      else {
        const result = await voucherRepository.update(id, {
          title,
          amount,
          condition,
          mfgDate,
          expDate,
        });
        if (result.affected == 1)
          return new Result(StatusCodes.OK, 'Update voucher successfully!');
        return new Result(StatusCodes.BAD_REQUEST, 'Update voucher failed!');
      }
    }

    static async deleteVoucher(account: Account, id: string) {
      const voucher = await voucherRepository.findOne({
        relations: {
          createdBy: true,
        },
        where: {
          id: id,
        },
      });
      if (voucher == null)
        return new Result(StatusCodes.BAD_REQUEST, 'Unavailable Voucher!');
      const result = await voucherRepository.delete(id);
      if (result.affected == 1)
        return new Result(StatusCodes.OK, 'Delete voucher successfully');
      return new Result(StatusCodes.BAD_REQUEST, 'Delete voucher failed!');
    }
  
    static async saveVoucher(account: Account, id: string) {
      const voucher = await voucherRepository.findOne({
        relations: {
          createdBy: true,
        },
        where: {
          id,
        },
      });
      if (voucher == null)
        return new Result(StatusCodes.BAD_REQUEST, 'Unavailable Voucher!');
        const newVoucher = await voucherRepository.update(
            { id: id },
            { account: voucher.account }
          );
          if (newVoucher.affected == 1) {
            return new Result(StatusCodes.OK, 'Report processed !');
          } else {
            return new Result(StatusCodes.BAD_REQUEST, 'Report is processing !');
          }
    }
  
}