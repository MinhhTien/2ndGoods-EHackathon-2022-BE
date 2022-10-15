import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CartService from "../services/cart";
import { ControllerService } from "../utils/decorators";

export default class CartController {
    @ControllerService()
    static async getOne(req: Request, res: Response) {
        const id = res.locals.account.id
      const result = await CartService.getOneById(id);
      if (result !== false) {
        res.status(StatusCodes.OK).send({ data: result });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Get Cart failed!' });
      }
    }

    @ControllerService({
        body: [
          {
            name: 'cart',
            type: String,
          },
        ],
      })
    static async edit(req: Request, res: Response) {
      const id = res.locals.account.id
      const result = await CartService.edit(id, req.body.cart);
        res
          .status(result.getCode())
          .send({ message: result.getMessage() });
      }
    
}