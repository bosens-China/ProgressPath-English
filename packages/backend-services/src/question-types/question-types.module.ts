import { Module } from '@nestjs/common';
import { QuestionTypesService } from './question-types.service';
import { QuestionTypesController } from './question-types.controller';

@Module({
  controllers: [QuestionTypesController],
  providers: [QuestionTypesService],
})
export class QuestionTypesModule {}
