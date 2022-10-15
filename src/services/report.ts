import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { Report } from "../entities/report";
import { StatusReportEnum } from "../utils/app.enum";
import Result from "../utils/result";

const reportReposity = AppDataSource.getRepository(Report)
const acountReposity = AppDataSource.getRepository(Account)
export default class ReportService {
    static async listAll() {
      const report = await reportReposity.find({
        relations: {
          account: true,
          reporter: true
        },
        select: {
          id: true,
          reporter: {
            name: true,
          },
          account: {
            name: true,
          },
          reportAt: true,
          reason: true,
          description: true,
          status: true,
        },
      });
      return report && report.length > 0 ? report : false;
    }
  
    static async getOneById(id: number) {
      const report = await reportReposity.find({
        relations: {
            account: true,
            reporter: true
          },
          select: {
            id: true,
            reporter: {
              name: true,
            },
            account: {
              name: true,
            },
            reportAt: true,
            reason: true,
            description: true,
            status: true,
          },
        where: {
          id: id,
        },
      });
      return report ? report : false;
    }
  
    static async viewReport(id: number) {
      const report = await reportReposity.find({
        select: {
            reportAt: true,
            reason: true,
            description: true,
            status: true,
        },
        where: {
          id: id,
        },
      });
      return report ? report : false;
    }
  
    static async postNew(
      accountId: number,
      reporter: Account,
      reason: string,
      description: string,
      status: StatusReportEnum
    ) {
      const account = await acountReposity.findOne({
        where: {
          id: accountId,
        },
      });
      if (account == null) {
        return new Result(
          StatusCodes.BAD_REQUEST,
          'Account is not exist !'
        );
      }
      const report = await reportReposity.findOne({
        relations: {
          account:true,
          reporter: true
        },
        where: {
          account: {id: account.id},
          reporter: {id: reporter.id},
          reason: reason,
          description: description,
          status: StatusReportEnum.PROCESSING,
        },
      });
      if (!(report == null)) {
        return new Result(StatusCodes.BAD_REQUEST, 'Report is in process !');
      } else {
        let newReport = new Report();
        (newReport.account = account),
          (newReport.reporter = reporter),
          (newReport.reason = reason),
          (newReport.description = description),
          (newReport.status = status),
          await reportReposity.save(newReport);
        return new Result(
          StatusCodes.CREATED,
          'Create new report successfully !',
          newReport
        );
      }
    }
  
    static async editStatus(id: number) {
      const report = await reportReposity.update(
        { id: id },
        { status: StatusReportEnum.PROCESSED }
      );
      if (report.affected == 1) {
        return new Result(StatusCodes.OK, 'Report processed !');
      } else {
        return new Result(StatusCodes.BAD_REQUEST, 'Report is processing !');
      }
    }
  }
  