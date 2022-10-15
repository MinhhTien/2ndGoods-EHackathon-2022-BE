import { Router } from "express";
import OrderMiddleware from "../controllers/order";
import { checkJwt } from "../middlewares/checkJwt";

const routes = Router();
routes.get(
    '/get-one-by-id/:id',
    OrderMiddleware.getOneById
  );

routes.get(
  '/view-order', checkJwt,
  OrderMiddleware.viewOrder
);

routes.get(
  '/view-order-history', checkJwt,
  OrderMiddleware.viewHistory
);

routes.post(
  '/new',
  checkJwt,
  OrderMiddleware.postNew
);

routes.post(
  '/cancer-order/:id',checkJwt,
  OrderMiddleware.cancerOrder
);

export default routes;