import { Router } from 'express';
import  product from './product';
import account from './account';
import auth from './auth';
import category from './category';
import path from "path"

const routes = Router();

routes.use('/get', async (req, res) => {
    res.sendFile(path.resolve("./resources/index.html"));
});

routes.use('/auth', auth);
routes.use('/account', account);
routes.use('/product', product);
routes.use('/category', category);

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;