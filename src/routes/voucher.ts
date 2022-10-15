import { Router } from "express";
import VoucherMiddleware from "../controllers/voucher";

const routes = Router();
routes.get(
    '/list-all',
    VoucherMiddleware.listAll
  );
  
  routes.get(
    '/get-one-by-id/:id',
    VoucherMiddleware.getOneById
  );
  
  routes.get(
    '/get-account-voucher/:id',
    VoucherMiddleware.getAccountVoucher
  );
  
  routes.post(
    '/new',
    VoucherMiddleware.newVoucher
  );
  
  routes.post(
    'edit/:id',
    VoucherMiddleware.editVoucher
  );
  
  routes.post(
    '/delete/:id',
    VoucherMiddleware.deleteVoucher
  );
  
  routes.post(
    '/save-voucher/:id',
    VoucherMiddleware.saveVoucher
  );
  export default routes;