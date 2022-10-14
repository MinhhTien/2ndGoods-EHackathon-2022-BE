import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../data';

type AsyncFunction = (...args: any[]) => Promise<any>;

interface ApiProperty {
  name: string;
  type?: Function;
  required?: boolean;
  /**
   * Validate function that takes the name of the property and its value to perform validations.
   * @param propertyName - name of the property.
   * @param value - the value of the property.
   * @return error message | no validation error found.
   */
  validator?: (propertyName: string, value: any) => string | null;
}

interface ControllerServiceOption {
  /**
   * Enable logs for headers, query, params and body.
   */
  deepWatch?: boolean;
  query?: ApiProperty[];
  params?: ApiProperty[];
  body?: ApiProperty[];
}

export interface ErrorElement {
  at: string;
  message: string;
}

export function ControllerService(options?: ControllerServiceOption) {
  return function (
    target: any,
    propKey: PropertyKey,
    propDescriptor: PropertyDescriptor
  ) {
    function addWatch(func: AsyncFunction) {
      return async function (req: Request, res: Response, next?: NextFunction) {
        console.log(
          `[${chalk.green(new Date().toLocaleString())}][${chalk.bold(
            req.method
          )} ${chalk.yellow(`${req.baseUrl}${req.path}`)}]`
        );
        if (options?.deepWatch) {
          console.log('Headers:');
          Object.keys(req.headers).forEach(key => {
            console.log(
              `\t${chalk.yellow(key)}: ${chalk.blue(
                JSON.stringify(req.headers[key])
              )}`
            );
          });
          console.log('Query:');
          Object.keys(req.query).forEach(key => {
            console.log(
              `\t${chalk.yellow(key)}: ${chalk.blue(
                JSON.stringify(req.query[key])
              )}`
            );
          });
          console.log('Params:');
          Object.keys(req.params).forEach(key => {
            console.log(
              `\t${chalk.yellow(key)}: ${chalk.blue(
                JSON.stringify(req.params[key])
              )}`
            );
          });
          console.log('Body:');
          Object.keys(req.body).forEach(key => {
            console.log(
              `\t${chalk.yellow(key)}: ${chalk.blue(
                JSON.stringify(req.body[key])
              )}`
            );
          });
        }
        try {
          await func(req, res);
          console.log(chalk.green('Executed successfully!'));
        } catch (err) {
          console.log(chalk.red('Execute with error:'));
          console.error(err);
          if (!res.headersSent)
            res
              .status(StatusCodes.BAD_REQUEST)
              .send({ message: 'Server error!' });
        }
      };
    }
    function addValidator(func: AsyncFunction) {
      return async function (req: Request, res: Response, next?: NextFunction) {
        let ok = true;
        let err = new Array<ErrorElement>();
        const queryKeys = Object.keys(req.query);
        const paramKeys = Object.keys(req.params);
        const bodyKeys = Object.keys(req.body);
        options?.query?.forEach(ele => {
          if (!queryKeys.includes(ele.name) && ele.required) {
            err.push({
              at: ele.name,
              message: `${ele.name} is missing.`,
            });
            ok = false;
          } else if (
            ele.type &&
            req.query[ele.name]?.constructor.name != ele.type.name
          ) {
            err.push({
              at: ele.name,
              message: `${ele.name} must be ${ele.type.name}.`,
            });
            ok = false;
          } else {
            const msg = ele.validator
              ? ele.validator(ele.name, req.query[ele.name])
              : null;
            if (msg) {
              err.push({
                at: ele.name,
                message: msg,
              });
              ok = false;
            }
          }
        });
        options?.params?.forEach(ele => {
          if (!paramKeys.includes(ele.name) && ele.required) {
            err.push({
              at: ele.name,
              message: `${ele.name} is missing.`,
            });
            ok = false;
          } else if (
            ele.type &&
            req.params[ele.name]?.constructor.name != ele.type.name
          ) {
            err.push({
              at: ele.name,
              message: `${ele.name} must be ${ele.type.name}.`,
            });
            ok = false;
          } else {
            const msg = ele.validator
              ? ele.validator(ele.name, req.params[ele.name])
              : null;
            if (msg) {
              err.push({
                at: ele.name,
                message: msg,
              });
              ok = false;
            }
          }
        });
        options?.body?.forEach(ele => {
          if (!bodyKeys.includes(ele.name) && ele.required) {
            err.push({
              at: ele.name,
              message: `${ele.name} is missing.`,
            });
            ok = false;
          } else if (
            ele.type &&
            req.body[ele.name]?.constructor.name != ele.type.name
          ) {
            err.push({
              at: ele.name,
              message: `${ele.name} must be ${ele.type.name}.`,
            });
            ok = false;
          } else {
            const msg = ele.validator
              ? ele.validator(ele.name, req.body[ele.name])
              : null;
            if (msg) {
              err.push({
                at: ele.name,
                message: msg,
              });
              ok = false;
            }
          }
        });
        if (!ok) {
          res.status(StatusCodes.BAD_REQUEST).send(err);
        } else {
          await func(req, res);
        }
      };
    }
    propDescriptor.value = addWatch(addValidator(target[propKey]));
  };
}
