import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import Account from "../entities/account";
import AccountService from "../services/account";
import config from '../utils/app.config';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    let token = <string>req.header('Authorization');
    if (token == '')
      res
        .status(StatusCodes.PERMANENT_REDIRECT)
        .send({ message: 'Please Login to 2ndGoods' });
    let jwtPayload;
    token = token?.replace('Bearer ', '');
    //Try to validate the token and get data
    try {
      jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
      const account: Account | null = await AccountService.getOneById(jwtPayload.accountId);
      if (account === null) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: 'Unauthorized: authentication required' });
      } else res.locals.account = account;
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: 'Unauthorized: authentication required' });
      return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { accountId, email } = jwtPayload;
    const newToken = jwt.sign({ accountId, email }, config.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.setHeader('Authentication', newToken);

    //Call the next middleware or controller
    next();
  }