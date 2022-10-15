import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PaymentService from "../services/payment";
import { ControllerService } from "../utils/decorators";

export default class PaymentMiddleware {
    @ControllerService()
    static async listAll(req: Request, res: Response) {
      const result = await PaymentService.listAll();
      if (result) {
        res.status(StatusCodes.OK).send({ data: result });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Get payment failed!' });
      }
    }
  
    @ControllerService()
    static async getOneById(req: Request, res: Response) {
      const id = +req.params.id;
      const result = await PaymentService.getOneById(id);
      if (result) {
        res.status(StatusCodes.OK).send({ data: result });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Get payment failed!' });
      }
    }
  
    @ControllerService({
      body: [
        {
          name: 'name',
          type: String,
        },
      ],
    })
    static async postNew(req: Request, res: Response) {
      const data = req.body;
      const result = await PaymentService.postNew(data.name);
      if (result.getCode() === StatusCodes.CREATED) {
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      } else {
        res.status(result.getCode()).send({ message: result.getMessage() });
      }
    }
  }