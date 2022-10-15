import { Router } from 'express';
import CategoryMiddleware from '../controllers/category';

const routes = Router();

routes.get('/list-all', CategoryMiddleware.listAll);

routes.get('/:id([0-9]+)', CategoryMiddleware.getOneById);

routes.post('/new', CategoryMiddleware.postNew);

export default routes;
