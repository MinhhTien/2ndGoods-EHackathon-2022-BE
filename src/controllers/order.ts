import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Account from "../entities/account";
import OrderService from "../services/order";
import { OrderStatusEnum } from "../utils/app.enum";
import { ControllerService } from "../utils/decorators";
import result from "../utils/result";

export default class OrderMiddleware{
    @ControllerService()
    static async viewOrder(req: Request, res: Response) {
        const account: Account = res.locals.account;
        if (account == null) {
           res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Can not find account !' });
        }
        const result = await OrderService.viewOrder(account);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get order list failed !' });
        }
      }

      @ControllerService()
    static async viewHistory(req: Request, res: Response) {
        const account: Account = res.locals.account;
        if (account == null) {
           res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Can not find account !' });
        }
        const result = await OrderService.viewHistory(account);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get order list failed !' });
        }
      }
    
      @ControllerService()
      static async getOneById(req: Request, res: Response) {
        const id = req.params.id;
        const result = await OrderService.getOneById(id);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get order failed !' });
        }
      }
    
      @ControllerService()
      static async postNew(req: Request, res: Response) {
        const account: Account = res.locals.account;
        const data = req.body;
        if (account == null) {
           res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Can not find account !' });
        }
        const result = await OrderService.postNew(
          account,
          data.address,
          data.totalBill,
          data.voucher,
          data.totalPayment,
          data.payment,
          OrderStatusEnum.CHECKING
        );
        if (result.getCode() === StatusCodes.CREATED) {
          res
            .status(result.getCode())
            .send({ message: result.getMessage(), data: result.getData() });
        } else {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
    
      @ControllerService()
      static async cancerOrder(req: Request, res: Response) {
        const id = req.params.id;
        const result = await OrderService.cancerOrder(id)
        if (result) {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
    }