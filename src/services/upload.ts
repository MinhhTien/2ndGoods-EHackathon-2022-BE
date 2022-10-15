import { Request, Response } from 'express';
import { AppDataSource } from '../data';
import { LocalFile } from '../entities/localFile';
import path from "path"

const localFileRepository = AppDataSource.getRepository(LocalFile);

export default class UploadService {
  static async getImage(req: Request, res: Response) {
    const fileName = req.params.name;
    const directoryPath = path.dirname(path.dirname(__dirname)) + "/public/uploads/";
    res.sendFile(path.join(directoryPath, fileName));
//     const fileName = req.params.name;
//   const directoryPath = path.dirname(path.dirname(__dirname)) + "/public/uploads/";

//   res.download(directoryPath + fileName, fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         message: "Could not download the file. " + err,
//       });
//     }
//   });
  }
  static async upload(file: Express.Multer.File) {
    let localFile: LocalFile = new LocalFile();
    localFile.filename = file.filename;
    localFile.path = file.path;

    await localFileRepository.save(localFile);
    return localFile;
  }

  static async uploadMultiple(
    files:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
  ) {
    let localFile: LocalFile;
    let localFiles: LocalFile[] = [];

    (files as Array<Express.Multer.File>).map(async file => {
      localFile = new LocalFile();
      localFile.filename = file.filename;
      localFile.path = file.path;

      localFiles.push(await localFileRepository.save(localFile));
    });
    return localFiles;
  }
}
