import { Router } from 'express';

const routes = Router();

routes.use('/get', async (req, res) => {
    res.send('Hello World!');
});

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;