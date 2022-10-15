import { StatusCodes } from "http-status-codes";
import Result from "../utils/result";
import { Like } from "typeorm";
import { AppDataSource } from "../data";
import Account from "../entities/account";
import { Category } from "../entities/category";
import { Product } from "../entities/product";
import { ProductEnum, StatusEnum } from "../utils/app.enum";

const productRepository =  AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);
export default class ProductService{
    static async listAll(){
        const product = await productRepository.find({
            relations: {
              account: true,
              category: true,
            },
            select: {
              id: true,
              name: true,
              detail: true,
              amount: true,
              quantity: true,
              status: true,
              sold: true,
              star: true,
              account: { name: true },
              category: { name: true },
            },
            where: [
              {
                status: ProductEnum.AVAILABLE,
              },
              { status: ProductEnum.OUT_OF_ORDER },
            ],
          });
          return product && product.length > 0 ? product : false;
        }

       static async getOneById(id: string){
        const product = await productRepository.find({
            relations: {
                account: true,
                category: true,
              },
              select: {
                id: true,
                name: true,
                detail: true,
                amount: true,
                quantity: true,
                status: true,
                sold: true,
                star: true,
                account: { name: true },
                category: { name: true },
              },
              where: [
                {
                  id: id,  
                  status: ProductEnum.AVAILABLE,
                },
                { 
                    id: id,
                    status: ProductEnum.OUT_OF_ORDER 
                },
              ],
            });
            return product ? product : false
          }

        static async searchByName(name: string){
            const product = await productRepository.find({
                relations: {
                account: true,
                category: true,
              },
              select: {
                id: true,
                name: true,
                detail: true,
                amount: true,
                quantity: true,
                status: true,
                sold: true,
                star: true,
                account: { name: true },
                category: { name: true },
              },
              where: [
                {
                  name: Like(`%${name}%`),  
                  status: ProductEnum.AVAILABLE,
                },
                { 
                    name: Like(`%${name}%`),
                    status: ProductEnum.OUT_OF_ORDER 
                },
              ],
            })
            return product ? product : false
        }
        
        static async searchByCategory(category: string){
            const product = await productRepository.find({
                relations: {
                    account: true,
                    category: true,
                  },
                  select: {
                    id: true,
                    name: true,
                    detail: true,
                    amount: true,
                    quantity: true,
                    status: true,
                    sold: true,
                    star: true,
                    account: { name: true },
                    category: { name: true },
                  },
                  where: [
                    {
                        category: { name: Like(`%${category}%`) },  
                      status: ProductEnum.AVAILABLE,
                    },
                    { 
                        category: { name: Like(`%${category}%`) },
                        status: ProductEnum.OUT_OF_ORDER 
                    },
                  ],
                })
                return product ? product: false
        }

        static async searchByCategoryId(id: number){
            const product = await productRepository.find({
                relations: {
                    account: true,
                    category: true,
                  },
                  select: {
                    id: true,
                    name: true,
                    detail: true,
                    amount: true,
                    quantity: true,
                    status: true,
                    sold: true,
                    star: true,
                    account: { name: true },
                    category: { name: true },
                  },
                  where: [
                    {
                      category: { id: id },  
                      status: ProductEnum.AVAILABLE,
                    },
                    { 
                        category: { id: id },  
                        status: ProductEnum.OUT_OF_ORDER 
                    },
                  ],
            })
            return product ? product : false
        }

        static async searchByAccount(id: number){
            const product = await productRepository.find({
                relations: {
                    account: true,
                    category: true,
                  },
                  select: {
                    id: true,
                    name: true,
                    detail: true,
                    amount: true,
                    quantity: true,
                    status: true,
                    sold: true,
                    star: true,
                    account: { name: true },
                    category: { name: true },
                  },
                  where: [
                    {
                      account: { id: id },  
                      status: ProductEnum.AVAILABLE,
                    },
                    { 
                        account: { id: id },  
                        status: ProductEnum.OUT_OF_ORDER 
                    },
                  ],
            })
            return product ? product : false
        }

        static async postNew(
            account: Account,
            name: string,
            categoryId: number,
            detail: string,
            amount: number,
            quantity: number,
            status: ProductEnum
          ) {
            const category = await categoryRepository.find({
              where: {
                id: categoryId,
              },
            });
            if (category == null) {
              return new Result(StatusCodes.BAD_REQUEST, 'category not exist.');
            } else {
              let product = new Product();
              product.account = account;
              product.name = name;
              product.category = category;
              product.detail = detail;
              product.amount = amount;
              product.quantity = quantity;
              product.status = status;
        
              await productRepository.save(product);
        
              return new Result(
                StatusCodes.CREATED,
                'Create new product successfully!',
                product
              );
            }
          }

          static async edit(
            id: string,
            name: string,
            categoryId: number,
            detail: string,
            amount: number,
            quantity: number,
            status: ProductEnum
          ){
            const category = await categoryRepository.find({
              where: {
                id: categoryId
              }
            })
            if(category==null){
              return new Result(StatusCodes.BAD_REQUEST, 'Category not found !!')
            } 
            const product = await productRepository.find({
              where: {
                id: id
              }
            })
            if(product == null){
              return new Result(StatusCodes.BAD_REQUEST, 'Product not found !!')
            }else{
              const productEdit = await productRepository.update(
                { id: id },
                {
                  name: name,
                  category: category,
                  detail: detail,
                  amount: amount,
                  quantity: quantity,
                  status: status,
                }
              );
              if(productEdit.affected == 1){
                return new Result(StatusCodes.OK, ' Edit successfully !')
              }else{
                return new Result(StatusCodes.BAD_REQUEST, 'Edit failed !')
              }
            }
          }

          static async delete(id: string){
            const product = await productRepository.find({
              where: {
                id: id
              }
            })
            if(product == null){
              return new Result(StatusCodes.BAD_REQUEST, 'Product not found !!')
            }else{
              const productDelete = await productRepository.update({id: id}, 
                {status: ProductEnum.DELETED})
                if(productDelete.affected == 1){
                  return new Result(StatusCodes.OK, 'Delete product successfully')
                }else{
                  return new Result(StatusCodes.BAD_REQUEST,'Delete product failed !')
                }
            }
          }
}