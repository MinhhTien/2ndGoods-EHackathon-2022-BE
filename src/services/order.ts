import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { Order } from "../entities/order";
import { Payment } from "../entities/payment";
import { Voucher } from "../entities/voucher";
import { OrderStatusEnum } from "../utils/app.enum";
import Result from "../utils/result";

const orderReposity = AppDataSource.getRepository(Order)
const acountReposity = AppDataSource.getRepository(Account)
const voucherReposity = AppDataSource.getRepository(Voucher)
const paymentReposity = AppDataSource.getRepository(Payment)
export default class OrderService {
    static async viewOrder(account: Account){
        const order = await orderReposity.find({
            relations: {
            payment: true,
            voucher: true,
            account: true
            },
            select: {
                id: true,
                createdAt: true,
                address: true,
                account: {
                    name: true
                },
                payment: {
                    name: true
                },
                totalBill: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
            where:[
            {
                account:{id: account.id} ,
                status: OrderStatusEnum.CHECKING,
            },
            {
                account:{id: account.id} ,
                status: OrderStatusEnum.CONFIRMED,
            },
            {
                account:{id: account.id} ,
                status: OrderStatusEnum.DELIVERING,
            },
        ]
        });
        return order ? order : false
    }

    static async viewHistory(account: Account){
        const order = await orderReposity.find({
            relations: {
                payment: true,
                voucher: true,
                account: true
                },
                select: {
                    id: true,
                    createdAt: true,
                    address: true,
                    account: {
                        name: true
                    },
                    payment: {
                        name: true
                    },
                    totalBill: true,
                    voucher: {
                        title: true
                    },
                    totalPayment: true,
                    status: true
                },
            where:{
                account:{id: account.id} ,
                status: OrderStatusEnum.DONE,
            }
        });
        return order ? order : false
    }
  
    static async getOneById(id: string) {
      const order = await orderReposity.find({
        relations: {
            payment: true,
            voucher: true,
            account: true
            },
            select: {
                id: true,
                createdAt: true,
                address: true,
                account: {
                    name: true
                },
                payment: {
                    name: true
                },
                totalBill: true,
                voucher: {
                    title: true
                },
                totalPayment: true,
                status: true
            },
        where:{
            id: id,
        }
    });
    return order ? order : false
    }
  
    static async postNew(
      account: Account,
      address: string,
      totalBill: number,
      voucherId: string,
      totalPayment: number,
      paymentId: number,
      status: OrderStatusEnum
    ) {
      const voucher = await voucherReposity.find({
        where: {
          id: voucherId,
        },
      });
      if (voucher == null) {
        return new Result(
          StatusCodes.BAD_REQUEST,
          'Voucher is not exist !'
        );
      }
      const payment = await paymentReposity.findOne({
        where: {
          id: paymentId,
        },
      });
      if (payment == null) {
        return new Result(
          StatusCodes.BAD_REQUEST,
          'Payment is not exist !'
        );
      }
        let newOrder = new Order();
        (newOrder.account = account),
          (newOrder.address = address),
          (newOrder.payment = payment),
          (newOrder.totalBill = totalBill),
          (newOrder.voucher = voucher),
          (newOrder.totalPayment = totalPayment),
          (newOrder.status = status),
          await orderReposity.save(newOrder);
        return new Result(
          StatusCodes.CREATED,
          'Create new order successfully!',
          newOrder
        );
    }
  
    static async cancerOrder(id: string) {
        const findOrder = await orderReposity.findOne({
            where:{
                id: id
            }
        })
        if(findOrder == null) return new Result(StatusCodes.BAD_REQUEST,'cannot find order')
        if( findOrder.status == OrderStatusEnum.CONFIRMED || findOrder.status == OrderStatusEnum.DELIVERING || findOrder.status == OrderStatusEnum.DONE )
        return new Result(StatusCodes.BAD_REQUEST,'cannot cancer order')
      const order = await orderReposity.update(
        { id: id },
        { status: OrderStatusEnum.CANCER }
      );
      if (order.affected == 1) {
        return new Result(StatusCodes.OK, 'cancer order successfull !');
      } else {
        return new Result(StatusCodes.BAD_REQUEST, 'cancer order failed !');
      }
    }
  }
  