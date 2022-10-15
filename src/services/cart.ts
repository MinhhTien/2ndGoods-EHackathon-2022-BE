import { StatusCodes } from "http-status-codes";
import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import { Cart } from "../entities/cart";
import { Category } from "../entities/category";
import { StatusEnum } from "../utils/app.enum";
import Result from "../utils/result";

const cartRepository: Repository<Cart> = AppDataSource.getRepository(Cart);

export default class CartService {
    static async getOneById(id: number) {
      const cart = await cartRepository.findOne({
        relations: {
            account: true,
        },
        where: {
          account: {
            id: id,
            status: StatusEnum.ACTIVE
          },
        },
      });
      return cart ? cart : false;
    }
  
    static async edit(id: number, cart: string) {
      const cartEntity = await cartRepository.findOne({
        relations: {
            account: true,
        },
        where: {
            account: {
                id: id,
                status: StatusEnum.ACTIVE
              },
        },
      });
  
      if (cartEntity != null) {
        cartEntity.cart=cart;
        await cartRepository.save(cartEntity);
        return new Result(
          StatusCodes.OK,
          'Update your cart successfully'
        );
      } else {
         return new Result(
          StatusCodes.FORBIDDEN,
          'Access is denied!'
        );
      }
    }
  }
  