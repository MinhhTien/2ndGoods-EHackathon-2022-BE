import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CategoryService from "../services/category";
import { ControllerService } from "../utils/decorators";

export default class CategoryMiddleware {
    @ControllerService()
    static async listAll(req: Request, res: Response) {
      const result = await CategoryService.listAll();
      if (result) {
        res.status(StatusCodes.OK).send({ data: result });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Get Category failed!' });
      }
    }
  
    @ControllerService()
    static async getOneById(req: Request, res: Response) {
      const id = +req.params.id;
      const result = await CategoryService.getOneById(id);
      if (result) {
        res.status(StatusCodes.OK).send({ data: result });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Get Category failed!' });
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
      const result = await CategoryService.postNew(data.name);
      if (result.getCode() === StatusCodes.CREATED) {
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      } else {
        res.status(result.getCode()).send({ message: result.getMessage() });
      }
    }
  }