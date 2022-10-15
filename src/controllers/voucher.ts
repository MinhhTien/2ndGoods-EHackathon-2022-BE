import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import VoucherService from "../services/voucher";
import { isValidDate } from "../utils";
import { ControllerService } from "../utils/decorators";

export default class VoucherMiddleware {
    @ControllerService()
    static async listAll(req: Request, res: Response) {
      const result = await VoucherService.listAll();
      if (result) res.status(StatusCodes.OK).send({ data: result });
      else
        res.status(StatusCodes.OK).send({ message: 'No vouchers available' });
    }
  
    @ControllerService()
    static async getOneById(req: Request, res: Response) {
      const id = req.params.id;
      const result = await VoucherService.getOneById(id);
      if (result) res.status(StatusCodes.OK).send({ data: result });
      else
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Unavailable voucher' });
    }

    @ControllerService()
    static async getAccountVoucher(req: Request, res: Response) {
      const id = req.params.id;
      const result = await VoucherService.getAccountVoucher(id);
      if (result) res.status(StatusCodes.OK).send({ data: result });
      else
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Unavailable voucher' });
    }
  
    @ControllerService({
      body: [
        {
          name: 'title',
          type: String,
          validator: (propName: string, value: string) => {
            if (value.length == 0) return `${propName} must be filled in`;
            return null;
          },
        },
        {
          name: 'amount',
          type: String,
          validator: (propName: string, value: string) => {
            const number = Number(value);
            if (!number) return `${propName} must be a number`;
            return null;
          },
        },
        {
          name: 'mfgDate',
          type: String,
          validator: (propName: string, value: string) => {
            if (!isValidDate(value)) return `${propName} is invalid`;
            return null;
          },
        },
        {
          name: 'expDate',
          type: String,
          validator: (propName: string, value: string) => {
            if (!isValidDate(value)) return `${propName} is invalid`;
            return null;
          },
        },
      ],
    })
    static async editVoucher(req: Request, res: Response) {
      const id = req.params.id;
      const data = req.body;
      const mfgDate = req.body.mfgDate;
      const expDate = req.body.expDate;
      const now = new Date();
      if (now <= mfgDate) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'mfgDate must be after today!' });
        return;
      }
      if (mfgDate > expDate) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'mfgDate must be smaller than expDate!' });
        return;
      }
      const result = await VoucherService.editVoucher(
        res.locals.account,
        id,
        data.title,
        data.amount,
        data.condition,
        mfgDate,
        expDate
      );
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  
    @ControllerService({
      body: [
        {
          name: 'title',
          type: String,
          validator: (propName: string, value: string) => {
            if (value.length == 0) return `${propName} must be filled in`;
            return null;
          },
        },
        {
          name: 'amount',
          type: String,
          validator: (propName: string, value: string) => {
            const number = Number(value);
            if (!number) return `${propName} must be a number`;
            return null;
          },
        },
        {
          name: 'mfgDate',
          type: String,
          validator: (propName: string, value: string) => {
            if (!isValidDate(value)) return `${propName} is invalid`;
            return null;
          },
        },
        {
          name: 'expDate',
          type: String,
          validator: (propName: string, value: string) => {
            if (!isValidDate(value)) return `${propName} is invalid`;
            return null;
          },
        },
      ],
    })
    static async newVoucher(req: Request, res: Response) {
      const data = req.body;
      const mfgDate = req.body.mfgDate;
      const expDate = req.body.expDate;
      const now = new Date();
      if (now >= mfgDate) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'mfgDate must be after today!' });
        return;
      }
      if (mfgDate > expDate) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'mfgDate must be smaller than expDate!' });
        return;
      }
      const result = await VoucherService.newVoucher(
        res.locals.user,
        data.title,
        data.amount,
        data.condition,
        mfgDate,
        expDate
      );
      if (result.getCode() == StatusCodes.OK)
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      else res.status(result.getCode()).send({ message: result.getMessage() });
    }
  
    @ControllerService()
    static async deleteVoucher(req: Request, res: Response) {
      const id = req.params.id;
      const result = await VoucherService.deleteVoucher(res.locals.user, id);
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  
    @ControllerService()
    static async saveVoucher(req: Request, res: Response) {
      const id = req.params.id;
      const result = await VoucherService.saveVoucher(res.locals.user, id);
      if (result.getCode() == StatusCodes.OK)
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      else res.status(result.getCode()).send({ message: result.getMessage() });
    }
}  