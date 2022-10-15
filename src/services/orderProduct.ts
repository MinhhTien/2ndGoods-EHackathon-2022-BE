import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data";
import { Order } from "../entities/order";
import { OrderProduct } from "../entities/orderProduct";
import { Product } from "../entities/product";
import Result from "../utils/result";

const orderProductRepository = AppDataSource.getRepository(OrderProduct)
const orderReposity = AppDataSource.getRepository(Order)
const productRepository = AppDataSource.getRepository(Product)
export default class OrderProductService {
    static async viewOrderProduct(orderNumber: string){
        const order = await orderProductRepository.find({
            relations: {
            product: true,
            orderNumber: true 
            },
            select: {
                id: true,
                price: true,
                quantity: true,
                product: {
                    name: true
                },
                orderNumber: {
                    id: true
                },
                additionalInfo: true,
            },
            where:{
                orderNumber: {id: orderNumber}
            }
        });
        return order ? order : false
    }

    static async postNew(
        price: number,
        quantity: number,
        additionalInfo: string,
        productId: string,
        orderNumber: string,
      ) {
        const product = await productRepository.findOne({
          where: {
            id: productId,
          },
        });
        if (product == null) {
          return new Result(
            StatusCodes.BAD_REQUEST,
            'product is not exist !'
          );
        }
        if( quantity > product.quantity || quantity < 1) return new Result(StatusCodes.BAD_REQUEST, 'quantity must be greater than 0 and less than product quantity')

        const order = await orderReposity.findOne({
            where: {
              id: orderNumber,
            },
          });
          if (order == null) {
            return new Result(
              StatusCodes.BAD_REQUEST,
              'Order is not exist !'
            );
          }
          let newOrderProduct = new OrderProduct();
          (newOrderProduct.price = price),
            (newOrderProduct.additionalInfo = additionalInfo),
            (newOrderProduct.quantity = quantity),
            (newOrderProduct.product = product),
            (newOrderProduct.orderNumber = order),
            await orderProductRepository.save(newOrderProduct);
          return new Result(
            StatusCodes.CREATED,
            'Create new order successfully!',
            newOrderProduct   
          );
      } 
  }