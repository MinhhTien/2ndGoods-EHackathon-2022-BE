import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrderProductService from "../services/orderProduct";
import { ControllerService } from "../utils/decorators";

export default class OrderProductMiddleware {
    @ControllerService()
    static async viewOrderProduct(req: Request, res: Response) {
      const orderNumber = req.params.id;
      const result = await OrderProductService.viewOrderProduct(orderNumber);
      if (result) {
        res.status(StatusCodes.OK).send({ data: result });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Get order product failed!' });
      }
    }

    @ControllerService()
      static async postNew(req: Request, res: Response) {
        const data = req.body;
        const result = await OrderProductService.postNew(
          data.price,
          data.quantity,
          data.additionalInfo,
          data.productId,
          data.orderNumber,
        );
        if (result.getCode() === StatusCodes.CREATED) {
          res
            .status(result.getCode())
            .send({ message: result.getMessage(), data: result.getData() });
        } else {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
    

}