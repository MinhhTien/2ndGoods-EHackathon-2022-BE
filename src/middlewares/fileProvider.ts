import fs from 'fs';
import multer from 'multer';
import { NextFunction, Request, RequestHandler } from 'express';
import AppConfig from '../utils/app.config';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const fileStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    callback: any
  ) {
    if (
      !fs.existsSync(
        path.join(path.dirname(path.dirname(__dirname)), AppConfig.IMAGE_PATH)
      )
    ) {
      fs.mkdirSync(
        path.join(
          path.dirname(path.dirname(__dirname)),
          AppConfig.IMAGE_PATH
        ),
        { recursive: true }
      );
    }
    callback(null, AppConfig.IMAGE_PATH);
  },
  filename: function (req: Request, file: Express.Multer.File, callback: any) {
    const fileInfo = file.mimetype.split('/');
    const fileName = `${fileInfo[0]}-${Date.now()}.${fileInfo[1]}`;
    callback(null, fileName);
  },
});

const limits = { fileSize: AppConfig.FILE_SIZE * 1024 * 1024 };

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any
) => {
  if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
    return callback(
      {
        errorMessage: 'Only image files are allowed!',
        code: 'LIMIT_FILE_TYPE',
      },
      false
    );
  }
  callback(null, true);
};

const videoFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any
) => {
  if (!file.originalname.match(/\.(mp4|ogg|wmv|webm|avi)$/))
    return callback(
      {
        errorMessage: 'Only video files are allowed!',
        code: 'LIMIT_FILE_TYPE',
      },
      false
    );
  callback(null, true);
};

export const uploadVideo = (key: string) => {
  return async (req: Request, res: any, next: NextFunction) => {
    let uploadVid = multer({
      fileFilter: videoFilter,
      storage: fileStorage,
      limits: limits,
    }).single(key);
    uploadVid(req, res, err => {
      if (err && err.code === 'LIMIT_FILE_TYPE')
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: err.errorMessage });
      else if (err && err.code === 'LIMIT_FILE_SIZE')
        return res.status(StatusCodes.BAD_REQUEST).send({
          error: 'Maximum file size allowed is ' + AppConfig.FILE_SIZE + 'MB',
        });
      next();
    });
  };
};

export const uploadImage = (key: string) => {
  return async (req: Request, res: any, next: NextFunction) => {
    let uploadImg = multer({
      fileFilter: imageFilter,
      storage: fileStorage,
      limits: limits,
    }).single(key);
    uploadImg(req, res, err => {
      if (err && err.code === 'LIMIT_FILE_TYPE')
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: err.errorMessage });
      else if (err && err.code === 'LIMIT_FILE_SIZE')
        return res.status(StatusCodes.BAD_REQUEST).send({
          error: 'Maximum file size allowed is ' + AppConfig.FILE_SIZE + 'MB',
        });
      next();
    });
  };
};

export const uploadMultipleImage = (key: string) => {
  return async (req: Request, res: any, next: NextFunction) => {
    let uploadMulImg = multer({
      fileFilter: imageFilter,
      storage: fileStorage,
      limits: limits,
    }).array(key, 10);
    uploadMulImg(req, res, err => {
      if (err && err.code === 'LIMIT_FILE_TYPE')
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: err.errorMessage });
      else if (err && err.code === 'LIMIT_FILE_SIZE')
        return res.status(StatusCodes.BAD_REQUEST).send({
          error: 'Maximum file size allowed is ' + AppConfig.FILE_SIZE + 'MB',
        });
      next();
    });
  };
};
