import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Account from "../entities/account";
import ReportService from "../services/report";
import { StatusReportEnum } from "../utils/app.enum";
import { ControllerService } from "../utils/decorators";
import Result from "../utils/result";

export default class ReportMiddleware{
    @ControllerService()
    static async listAll(req: Request, res: Response) {
        const result = await ReportService.listAll();
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get report fail !' });
        }
      }
    
      @ControllerService()
      static async getOneById(req: Request, res: Response) {
        const id = +req.params.id;
        const result = await ReportService.getOneById(id);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get report fail !' });
        }
      }
    
      @ControllerService()
      static async viewReport(req: Request, res: Response) {
        const id = +req.params.id;
        const result = await ReportService.viewReport(id);
        if (result) {
          res.status(StatusCodes.OK).send({ data: result });
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Get report fail !' });
        }
      }
    
      @ControllerService({
        params: [
          {
            name: 'accountId',
            type: String,
          },
        ],
        body: [
          {
            name: 'reason',
            type: String,
            validator: (propName: string, value: string) => {
                if (
                  value.toUpperCase() !== 'CONATAIN_SENSITIVE_INFO' &&
                  value.toUpperCase() !== 'SCAM'&&
                  value.toUpperCase() !== 'INACCURATE_MISLEADING'&&
                  value.toUpperCase() !== 'OTHER_REASON'
                )
                  return `please choose ${propName}: CONATAIN_SENSITIVE_INFO or SCAM or INACCURATE_MISLEADING or OTHER_REASON`;
                return null;
              },
          },
          {
            name: 'description',
            type: String,
          },
        ],
      })
      static async postNew(req: Request, res: Response) {
        const reporter: Account = res.locals.account;
        const accountId = +req.params.accountId;
        const data = req.body;
        if (reporter == null) {
           res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'Can not find customer !' });
        }
        const result = await ReportService.postNew(
          accountId,
          reporter,
          data.reason,
          data.description,
          StatusReportEnum.PROCESSING
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
      static async editStatus(req: Request, res: Response) {
        const id = +req.params.id;
        const email : string = res.locals.account.email 
        if(email.includes("admin")){
            const result = await ReportService.editStatus(id);
        if (result) {
          res.status(result.getCode()).send({ message: result.getMessage() });
        }
        }else{
            res.status(StatusCodes.FORBIDDEN).send({message: "Unauthorized"})
        }
        
      }
    }
    