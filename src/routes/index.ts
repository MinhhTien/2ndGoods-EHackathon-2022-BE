import express, { Router } from 'express';
import  product from './product';
import account from './account';
import auth from './auth';
import category from './category';
import report from './report';
import UploadService from '../services/upload';

const routes = Router();

routes.get('/files/:name', UploadService.getImage);
routes.use('/images', express.static(__dirname + '/public/uploads'));
routes.use('/auth', auth);
routes.use('/account', account);
routes.use('/product', product);
routes.use('/category', category);
routes.use('/report', report);

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;