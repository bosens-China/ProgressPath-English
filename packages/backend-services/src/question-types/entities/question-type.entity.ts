// import { ApiProperty } from '@nestjs/swagger'; // Removed

export class QuestionTypeEntity {
  // @ApiProperty() // Removed
  id: number;

  // @ApiProperty() // Removed
  name: string;

  // @ApiProperty({ required: false, nullable: true }) // Removed
  description?: string | null;

  // @ApiProperty() // Removed
  createdAt: Date;

  // @ApiProperty() // Removed
  updatedAt: Date;
}
