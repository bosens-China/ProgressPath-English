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
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { FindSectionsQueryDto } from './dto/find-sections-query.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  /**
   * @description 批量创建小节
   */
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  createMany(
    @Body(new ValidationPipe({ transform: true }))
    createSectionDtos: CreateSectionDto[],
  ) {
    return this.sectionsService.createMany(createSectionDtos);
  }

  /**
   * @description 分页获取小节列表 (支持排序和筛选)
   */
  @Get()
  findAllPaginated(@Query() query: FindSectionsQueryDto) {
    return this.sectionsService.findAllPaginated(query);
  }

  /**
   * @description 获取所有小节列表 (无分页)
   */
  @Get('all')
  findAll() {
    return this.sectionsService.findAll();
  }

  /**
   * @description 获取指定ID的小节信息
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  /**
   * @description 更新指定ID的小节信息
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  /**
   * @description 删除指定ID的小节
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.remove(id);
  }
}
