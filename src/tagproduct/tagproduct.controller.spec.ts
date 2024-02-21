import { Test, TestingModule } from '@nestjs/testing';
import { TagproductController } from './tagproduct.controller';

describe('TagproductController', () => {
  let controller: TagproductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagproductController],
    }).compile();

    controller = module.get<TagproductController>(TagproductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
