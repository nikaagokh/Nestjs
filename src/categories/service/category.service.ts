import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../model/categories.entity";
import { EntityManager, Repository } from "typeorm";
import { CategoryYear } from "src/categories/model/category-year.entity";
import { Observable, from } from "rxjs";
import { CreateChild } from "../dtos/create-child.dto";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { CreateParent } from "../dtos/create-parent.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private catRepo:Repository<Category>,
        @InjectRepository(CategoryYear) private catYearRepo:Repository<CategoryYear>,
        private entityManager:EntityManager,
    ) {}


    async getAllCategories() {
        return await this.catRepo.createQueryBuilder('cat').where('cat.categoryId is null').getMany();
       
    }

    async getAllCategoriesAndChildren() {
        const rootsWithSubs = await this.catRepo.createQueryBuilder('cat')
        .leftJoinAndSelect('cat.subcategories', 'sub')
        .leftJoinAndSelect('sub.cyear', 'catyear')
        .leftJoinAndSelect('catyear.year', 'year')
        .getMany()
        return this.rootsWithSubs(rootsWithSubs);
        
    }


    async getOne(id:number) {
        return await this.catRepo.createQueryBuilder('cat').where(`cat.id = ${id}`).getOne();
    }

    async addParent(fileName:string, category:CreateParent) {
        const exists = await this.catRepo.createQueryBuilder('cat').where(`cat.name = '${category.name}'`).getOne();
        if(exists) throw new HttpException('already exists', HttpStatus.BAD_REQUEST);
        const cat = new Category();
        cat.name = category.name;
        cat.image = fileName;
        return await this.catRepo.save(cat);
    }

    async addChild(fileName:string, category:CreateChild) {
        const exists = await this.catRepo.createQueryBuilder('cat').where(`cat.name = '${category.name}'`).getOne();
        if(exists) throw new HttpException('already exists', HttpStatus.BAD_REQUEST);
        const parent = await this.catRepo.createQueryBuilder('cat').where(`cat.id = ${category.parentId}`).getOne();
        if(!parent) throw new HttpException('parent not found', HttpStatus.BAD_REQUEST);
        const cat = new Category();
        cat.name = category.name;
        cat.image = parent.image;
        cat.categoryId = category.parentId;
        const child = await this.catRepo.save(cat);
        if(!child) throw new HttpException('child does not added', HttpStatus.BAD_REQUEST);
        const catyear = new CategoryYear;
        catyear.category = child;
        catyear.imageUrl = fileName;
        catyear.yearId = category.range
        await this.catYearRepo.save(catyear);
        return child;
    }

    async updateChild(id:number, fileName:string) {
        ///
    }

    async updateOne(id:number, obj:any) {
        const name = obj.name;
        const category = await this.catRepo.createQueryBuilder('cat').where(`cat.id = ${id}`).getOne();
        if(!category) throw new HttpException('category dont exist', HttpStatus.BAD_REQUEST);
        category.name = name;
        return await this.catRepo.save(category);
    }

    async getDescendants(id:number) {
    
        const catArr:Array<any> = await this.catRepo.query(
            `
            WITH RECURSIVE CTE AS (
                SELECT c.id, c.name, cy.imageUrl, y.start, y.end
                FROM category c
                left join category_year cy on c.id = cy.categoryId
                left join year y on cy.yearId = y.id
                WHERE c.categoryId = ${id}
                UNION ALL
                SELECT e.id, e.name, cy.imageUrl, y.start, y.end
                FROM category e
                left join category_year cy on e.id = cy.categoryId
                left join year y on cy.yearId = y.id
                INNER JOIN CTE c ON e.categoryId = c.id
            )
            SELECT * FROM CTE;

            `
        );
        return catArr.map(cat => ({
            ...cat,
            "range": `${cat.start}-${cat.end}`,
            
        })) 

    }

    async getAncestors(id:number) {
        return await this.catRepo.query(
            `
            WITH RECURSIVE CTE AS (
                SELECT id, name, categoryId, image
                FROM category
                WHERE id = ${id}
                UNION ALL
                SELECT e.id, e.name, e.categoryId, e.image
                FROM category e
                INNER JOIN CTE c ON e.id = c.categoryId
            )
            SELECT * FROM CTE;

            `
        );
       
    }
    private async rootsWithSubs(rootsWithSubs:Category[]) {
        rootsWithSubs.map((cat) => {
            delete cat.categoryId
            cat.subcategories.map((subcat) => {
                delete subcat.categoryId;
                subcat.cyear.map((cyear) => {
                    delete cyear.id;
                    delete cyear.categoryId;
                    delete cyear.yearId;
                    delete cyear.year.id
                    cyear.range = `${cyear.year.start} - ${cyear.year.end}`;
                    delete cyear.year 
                })
            })
        })
        return rootsWithSubs;
    }

}