import { Like } from "typeorm";
import { AppDataSource } from "../data";
import { Product } from "../entities/product";
import { ProductEnum } from "../utils/app.enum";

const productRepository =  AppDataSource.getRepository(Product);
export default class ProdictMoodel{
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

        static async searchProductByName(name: string){
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
        }
}