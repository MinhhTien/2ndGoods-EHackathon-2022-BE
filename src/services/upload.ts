import { AppDataSource } from '../data';
import { LocalFile } from '../entities/localFile';

const localFileRepository = AppDataSource.getRepository(LocalFile);

export default class UploadService {
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

    (files as Array<Express.Multer.File>).map(async file => {
      localFile = new LocalFile();
      localFile.filename = file.filename;
      localFile.path = file.path;

      await localFileRepository.save(localFile);
    });
  }
}
