import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Account from "../entities/account";
import ProductService from "../services/product";
import { ProductEnum } from "../utils/app.enum";
import { ControllerService } from "../utils/decorators";

export default class ProductMiddleware{
    @ControllerService()
    static async listAll(req: Request, res: Response) {
        const result = await ProductService.listAll();
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get Product failed!' });
        }
      }

      @ControllerService({
        params: [
          {
            name: 'id',
            type: String,
          },
        ],
      })
      static async getOneById(req: Request, res: Response) {
        const id = req.params.id;
        const result = await ProductService.getOneById(id);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get Product failed!' });
        }
      }
    
      @ControllerService({
        params: [
          {
            name: 'name',
            type: String,
          },
        ],
      })
      static async searchByName(req: Request, res: Response) {
        const name = req.params.name;
        const result = await ProductService.searchByName(name);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get Product failed!' });
        }
      }
    
      @ControllerService()
      static async searchByCategoryId(req: Request, res: Response) {
        const id = +req.params.categoryId;
        const result = await ProductService.searchByCategoryId(id);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get Product failed!' });
        }
      }
    
      @ControllerService({
        params: [
          {
            name: 'name',
            type: String,
          },
        ],
      })
      static async searchByCategory(req: Request, res: Response) {
        const name = req.params.name;
        const result = await ProductService.searchByCategory(name);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get Product failed!' });
        }
      }
    
      @ControllerService()
      static async searchByAccount(req: Request, res: Response) {
        const id = +req.params.id;
        const result = await ProductService.searchByAccount(id);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get Product failed!' });
        }
      }
    
      @ControllerService({
        body: [
          {
            name: 'name',
            type: String,
          },
          {
            name: 'categoryId',
            type: String,
          },
    
          {
            name: 'detail',
            type: String,
          },
          {
            name: 'amount',
            type: String,
            validator: (propName: string, value: number) => {
              if (value < 0 || value > 100000000) {
                return `${propName} must be greater than 0 and less than 100000000`;
              }
              return null;
            },
          },
          {
            name: 'quantity',
            type: String,
            validator: (propName: string, value: number) => {
              if (value < 0 || value > 10000) {
                return `${propName} must be greater than 0 and less than 10000`;
              }
              return null;
            },
          },
        ],
      })
      static async postNew(req: Request, res: Response) {
        const data = req.body;
        const account = res.locals.account;
        if (account == null) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Can not find account' });
        }
        const result = await ProductService.postNew(
          account,
          data.name,
          data.categoryId,
          data.detail.toString(),
          data.amount,
          data.quantity,
          ProductEnum.AVAILABLE
        );
    
        if (result.getCode() === StatusCodes.CREATED) {
          res
            .status(result.getCode())
            .send({ message: result.getMessage(), data: result.getData() });
        } else {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
    
      @ControllerService({
        params: [
          {
            name: 'id',
            type: String,
          },
        ],
        body: [
          {
            name: 'name',
            type: String,
          },
          {
            name: 'category',
            type: String,
          },
    
          {
            name: 'detail',
            type: String,
          },
          {
            name: 'amount',
            type: String,
            validator: (propName: string, value: number) => {
              if (value < 0 || value > 100000000) {
                return `${propName} must be greater than 0 and less than 100000000`;
              }
              return null;
            },
          },
          {
            name: 'quantity',
            type: String,
            validator: (propName: string, value: number) => {
              if (value < 0 || value > 10000) {
                return `${propName} must be greater than 0 and less than 10000`;
              }
              return null;
            },
          },
          {
            name: 'status',
            type: String,
            validator: (propName: string, value: string) => {
              if (
                value.toUpperCase() !== 'AVAILABLE' &&
                value.toUpperCase() !== 'OUT-OF-ORDER'
              )
                return `${propName} is only AVAILABLE or OUT-OF-ORDER`;
              return null;
            },
          },
        ],
      })
      static async edit(req: Request, res: Response) {
        const data = req.body;
        const id = req.params.id;
        let status: ProductEnum;
        if (data.status.toString().toUpperCase() === 'AVAILABLE') {
          status = ProductEnum.AVAILABLE;
        } else {
          status = ProductEnum.OUT_OF_ORDER;
        }
        const result = await ProductService.edit(
          id,
          data.name,
          data.category,
          data.detail.toString(),
          data.amount,
          data.quantity,
          status
        );
        if (result.getCode() === StatusCodes.OK) {
          res
            .status(result.getCode())
            .send({ message: result.getMessage(), data: result.getData() });
        } else {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
      }
    
      @ControllerService({
        params: [
          {
            name: 'id',
            type: String,
          },
        ],
      })
      static async delete(req: Request, res: Response) {
        const id = req.params.id;
        const result = await ProductService.delete(id);
        res.status(result.getCode()).send({ message: result.getMessage() });
      }  
}