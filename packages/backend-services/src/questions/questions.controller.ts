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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindQuestionsQueryDto } from './dto/find-questions-query.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * @description 创建新问题
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ transform: true }))
    createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.create(createQuestionDto);
  }

  /**
   * @description 批量创建问题
   */
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  createMany(
    @Body(new ValidationPipe({ transform: true }))
    createQuestionDtos: CreateQuestionDto[],
  ) {
    return this.questionsService.createMany(createQuestionDtos);
  }

  /**
   * @description 分页获取问题列表 (支持筛选和排序)
   */
  @Get()
  findAllPaginated(@Query() query: FindQuestionsQueryDto) {
    return this.questionsService.findAllPaginated(query);
  }

  /**
   * @description 获取所有问题列表 (可选按 sectionId 筛选)
   */
  @Get('all')
  findAll(
    @Query('sectionId', new ParseIntPipe({ optional: true }))
    sectionId?: number,
  ) {
    return this.questionsService.findAll(sectionId);
  }

  /**
   * @description 获取指定ID的问题信息
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  /**
   * @description 更新指定ID的问题信息
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  /**
   * @description 删除指定ID的问题
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}
