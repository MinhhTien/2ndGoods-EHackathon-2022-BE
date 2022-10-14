import { Router } from 'express';
import AccountController from '../controllers/account';
import { checkJwt } from '../middlewares/checkJwt';

const routes = Router();

//Login route
routes.get('/:id([0-9]+)', checkJwt, AccountController.getOneById);

//Create a new user
routes.post('/sign-up', AccountController.postNew);

//Delete one user
routes.post('/delete', checkJwt, AccountController.delete);

export default routes;