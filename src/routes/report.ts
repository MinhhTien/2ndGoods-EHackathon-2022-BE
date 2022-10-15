import { Router } from "express";
import ReportMiddleware from "../controllers/report";
import { checkJwt } from "../middlewares/checkJwt";

const routes = Router();

routes.get(
  '/list-all',
  ReportMiddleware.listAll
);

routes.get(
  '/get-report/:id([0-9]+)',
  ReportMiddleware.getOneById
);

routes.get(
  '/view-report/:id([0-9]+)',
  ReportMiddleware.viewReport
);

routes.post(
  '/new/:accountId',
  checkJwt,
  ReportMiddleware.postNew
);

routes.post(
  '/edit-status/:id([0-9]+)',checkJwt,
  ReportMiddleware.editStatus
);

export default routes;
