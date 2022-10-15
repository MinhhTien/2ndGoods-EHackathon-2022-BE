import { Router } from "express";
import OrderProductMiddleware from "../controllers/orderProduct";
import { checkJwt } from "../middlewares/checkJwt";

const routes = Router();
routes.get(
    '/view-order-product/:id', checkJwt,
    OrderProductMiddleware.viewOrderProduct
  );

routes.post(
  '/new',
  checkJwt,
  OrderProductMiddleware.postNew
);

export default routes;