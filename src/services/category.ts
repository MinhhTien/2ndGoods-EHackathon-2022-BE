import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data";
import { Category } from "../entities/category";
import Result from "../utils/result";

const categoryRepository = AppDataSource.getRepository(Category);

export default class CategoryService {
  static async listAll() {
    const category = await categoryRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
    return category && category.length > 0 ? category : false;
  }

  static async getOneById(id: number) {
    const category = await categoryRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: id,
      },
    });
    return category ? category : false;
  }

  static async postNew(name: string) {
    const category = await categoryRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: name,
      },
    });

    if (!(category == null)) {
      return new Result(
        StatusCodes.BAD_REQUEST,
        'Category already exist !',
        category
      );
    } else {
      let newCategory = new Category();
      newCategory.name = name;
      await categoryRepository.save(newCategory);

      return new Result(
        StatusCodes.CREATED,
        'Create new category successfully!',
        newCategory
      );
    }
  }
}
