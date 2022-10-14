import { Router } from 'express';
import account from './account';
import auth from './auth';

const routes = Router();

routes.use('/get', async (req, res) => {
    res.send('Hello World!');
});

routes.use('/auth', auth);
routes.use('/account', account);

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;