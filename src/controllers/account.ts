import { Request, Response } from "express";
import AccountService from "../services/account";
import { ControllerService } from "../utils/decorators";
import { StatusCodes } from 'http-status-codes';

export default class AccountController {
    @ControllerService()
    static async getOneById(req: Request, res: Response) {
        const id = +req.params.id;
        const result = await AccountService.getOneById(id);
        if (result) {
            res.status(StatusCodes.OK).send({ data: result });
        } else {
            res
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: 'Account not exist!' });
        }
    }

    @ControllerService({
        body: [
            {
                name: 'email',
                type: String,
                validator: (propName: string, value: string) => {
                    const emailRegExp: RegExp = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
                    if (!emailRegExp.test(value))
                        return `${propName} must be valid email`;
                    return null;
                },
            },
            {
                name: 'password',
                type: String,
                validator: (propName: string, value: string) => {
                    const pwdRegExp: RegExp =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*(\-_+=`~\?\/])(?=.{8,})/;
                    if (!pwdRegExp.test(value))
                        return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
                    return null;
                },
            },
            {
                name: 'confirmPassword',
                type: String,
                validator: (propName: string, value: string) => {
                    const pwdRegExp: RegExp =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*(\-_+=`~\?\/])(?=.{8,})/;
                    if (!pwdRegExp.test(value))
                        return `${propName} must constain 8 characters or longer, at least one lowercase, one uppercase, one number and one special character`;
                    return null;
                },
            }
        ],
    })
    static async postNew(req: Request, res: Response) {
        const data = req.body;
        if (data.password !== data.confirmPassword)
            res
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: 'Confirmed Password must be equal to Password' });
        const result = await AccountService.postNew(
            String(data.email).toLowerCase(),
            data.password
        );
        if (result.getCode() === StatusCodes.CREATED) {
            res
                .status(result.getCode())
                .send({ message: result.getMessage(), data: result.getData() });
        } else {
            res.status(result.getCode()).send({ message: result.getMessage() });
        }
    }
    @ControllerService()
    static async delete(req: Request, res: Response) {
        const id = res.locals.user.id;
        const result = await AccountService.delete(id);
        res.status(result.getCode()).send({ message: result.getMessage() });
    }
}