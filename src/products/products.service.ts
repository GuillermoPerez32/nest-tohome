import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { images = [], ...productDetail } = createProductDto;
    try {
      const product = this.productRepository.create({
        ...productDetail,
        user,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
      order: {
        id: 'ASC',
      },
    });
    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${id} doesn't exists`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...updateBody } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...updateBody,
    });

    if (!product)
      throw new BadRequestException(`Product with id ${id} doesn't exists`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((img) =>
          this.productImageRepository.create({ url: img }),
        );
      }

      product.user = user;
      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new BadRequestException(`Product with id ${id} doesn't exists`);
    return this.productRepository.remove(product);
  }

  handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
