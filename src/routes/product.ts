import { Router } from "express";
import ProductMiddleware from "../controllers/product";
import { checkJwt } from "../middlewares/checkJwt";
import { uploadMultipleImage } from '../middlewares/fileProvider';

const routes = Router();

routes.get('/list-all', ProductMiddleware.listAll); 
routes.get('/get-one-by-id/:id', ProductMiddleware.getOneById); 
routes.get('/search-by-name/:name', ProductMiddleware.searchByName);

routes.get(
  '/search-by-categoryId/:id([0-9]+)',
  ProductMiddleware.searchByCategoryId
);

routes.get(
  '/search-by-category-name/:name',
  ProductMiddleware.searchByCategory
);

routes.get('/search-by-account/:id', ProductMiddleware.searchByAccount);

routes.post(
  '/new', checkJwt, 
  uploadMultipleImage('images'),
  ProductMiddleware.postNew
);

routes.post(
  '/edit/:id',checkJwt,
  ProductMiddleware.edit
);

routes.post(
  '/delete/:id',checkJwt,
  ProductMiddleware.delete
);
export default routes;
