import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProductService } from 'src/product/service/product.service';

@Injectable()
export class ProductViewMiddleware implements NestMiddleware {
    constructor(private productService:ProductService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const prodId = Number(req.params.id);
    await this.productService.incrementViews(prodId);
    next();
  }
}
