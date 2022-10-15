import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data";
import { Payment } from "../entities/payment";
import Result from "../utils/result";

const PaymentRepository = AppDataSource.getRepository(Payment);

export default class PaymentService {
  static async listAll() {
    const payment = await PaymentRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
    return payment && payment.length > 0 ? payment : false;
  }

  static async getOneById(id: number) {
    const payment = await PaymentRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: id,
      },
    });
    return payment ? payment : false;
  }

  static async postNew(name: string) {
    const payment = await PaymentRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: name,
      },
    });

    if (!(payment == null)) {
      return new Result(
        StatusCodes.BAD_REQUEST,
        'Payment already exist !',
        payment
      );
    } else {
      let newPayment= new Payment();
      newPayment.name = name;
      await PaymentRepository.save(newPayment);

      return new Result(
        StatusCodes.CREATED,
        'Create new payment successfully!',
        newPayment
      );
    }
  }


}