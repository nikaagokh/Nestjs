import { Product } from "src/product/model/product.entity";

export interface ICart {
    products?:Product[];
    discount?:number;
    total?:number;
    
}