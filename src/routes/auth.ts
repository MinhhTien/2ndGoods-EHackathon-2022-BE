import { Router } from 'express';
import AuthController from '../controllers/auth';

const routes = Router();

//Login route
routes.post('/login', AuthController.login);

export default routes;