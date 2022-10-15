import { Router } from 'express';
import CartController from '../controllers/cart';
import { checkJwt } from '../middlewares/checkJwt';

const routes = Router();

routes.get('/get', checkJwt, CartController.getOne);

routes.post('/edit', checkJwt, CartController.edit);

export default routes;