import { Router } from 'express';
import PaymentMiddleware from '../controllers/payment';

const routes = Router();

routes.get('/list-all', PaymentMiddleware.listAll);

routes.get('/:id([0-9]+)', PaymentMiddleware.getOneById);

routes.post('/new', PaymentMiddleware.postNew);

export default routes;
