// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateQuestionTypeDto {
  // @ApiProperty({ description: '问题类型的名称', example: '单选题' })
  @IsNotEmpty({ message: '类型名称不能为空' })
  @IsString()
  @MaxLength(100, { message: '类型名称长度不能超过100个字符' })
  name: string;

  // @ApiProperty({
  //   description: '问题类型的描述 (可选)',
  //   example: '只有一个正确答案的选择题',
  //   required: false,
  // })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '类型描述长度不能超过500个字符' })
  description?: string;
}
