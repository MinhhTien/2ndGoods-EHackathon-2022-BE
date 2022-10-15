import { Router } from 'express';
import AccountController from '../controllers/account';
import { checkJwt, getAccountByJwt } from '../middlewares/checkJwt';
import { uploadImage } from '../middlewares/fileProvider';

const routes = Router();

//Login route
routes.get('/:id([0-9]+)', checkJwt, AccountController.getOneById);

routes.get('/get-by-token', getAccountByJwt);

//Create a new account
routes.post('/sign-up', AccountController.postNew);

//Edit one account
routes.post(
    '/edit',
    checkJwt,
    uploadImage('avatar'),
    AccountController.edit
  );

//Change password account
routes.post('/change-password', checkJwt, AccountController.changePassword);

//Delete one user
routes.post('/delete', checkJwt, AccountController.delete);

export default routes;