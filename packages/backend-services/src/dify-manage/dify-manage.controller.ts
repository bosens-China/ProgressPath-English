import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { DifyManageService } from './dify-manage.service';
import { CreateDifyManageDto } from './dto/create-dify-manage.dto';
import { UpdateDifyManageDto } from './dto/update-dify-manage.dto';
import { FindDifyManageQueryDto } from './dto/find-dify-manage-query.dto';

@Controller('dify-manage')
export class DifyManageController {
  constructor(private readonly difyManageService: DifyManageService) {}

  /**
   * @description 创建Dify管理
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ transform: true }))
    createDifyManageDto: CreateDifyManageDto,
  ) {
    return this.difyManageService.create(createDifyManageDto);
  }

  /**
   * @description 分页获取Dify管理列表
   */
  @Get()
  findAllPaginated(
    @Query(new ValidationPipe({ transform: true }))
    query: FindDifyManageQueryDto,
  ) {
    return this.difyManageService.findAllPaginated(query);
  }

  /**
   * @description 获取所有Dify管理列表 (无分页)
   */
  @Get('all')
  findAll() {
    return this.difyManageService.findAll();
  }

  /**
   * @description 获取指定ID的Dify管理
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.difyManageService.findOne(id);
  }

  /**
   * @description 更新指定ID的Dify管理
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateDifyManageDto: UpdateDifyManageDto,
  ) {
    return this.difyManageService.update(id, updateDifyManageDto);
  }

  /**
   * @description 删除指定ID的Dify管理
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.difyManageService.remove(id);
  }
}
