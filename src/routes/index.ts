import express, { Router } from 'express';
import  product from './product';
import account from './account';
import auth from './auth';
import cart from './cart';
import category from './category';
import report from './report';
import voucher from './voucher';
import order from './order';
import payment from './payment';
import orderProduct from './orderProduct';
import UploadService from '../services/upload';

const routes = Router();

routes.get('/files/:name', UploadService.getImage);
routes.use('/images', express.static(__dirname + '/public/uploads'));
routes.use('/auth', auth);
routes.use('/cart', cart);
routes.use('/account', account);
routes.use('/product', product);
routes.use('/category', category);
routes.use('/report', report);
routes.use('/voucher', voucher);
routes.use('/order', order);
routes.use('/payment', payment);
routes.use('/order-product', orderProduct);

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;