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
  ValidationPipe,
} from '@nestjs/common';
import { QuestionTypesService } from './question-types.service';
import { CreateQuestionTypeDto } from './dto/create-question-type.dto';
import { UpdateQuestionTypeDto } from './dto/update-question-type.dto';
import { FindQuestionTypesQueryDto } from './dto/find-question-types-query.dto';

@Controller('question-types')
export class QuestionTypesController {
  constructor(private readonly questionTypesService: QuestionTypesService) {}

  @Post()
  create(@Body(ValidationPipe) createQuestionTypeDto: CreateQuestionTypeDto) {
    return this.questionTypesService.create(createQuestionTypeDto);
  }

  @Get('')
  findAllPaginated(@Query(ValidationPipe) query: FindQuestionTypesQueryDto) {
    return this.questionTypesService.findAllPaginated(query);
  }

  @Get('all')
  findAllLite() {
    return this.questionTypesService.findAllLite();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateQuestionTypeDto: UpdateQuestionTypeDto,
  ) {
    return this.questionTypesService.update(id, updateQuestionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionTypesService.remove(id);
  }
}
