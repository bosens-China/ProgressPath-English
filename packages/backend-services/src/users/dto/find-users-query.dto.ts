import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';

export class FindUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  phone?: string; // For filtering by phone number (can be partial or exact based on service logic)

  @IsOptional()
  @IsString()
  nickname?: string; // For filtering by nickname (fuzzy search)

  @IsOptional()
  @IsDateString()
  registrationDateFrom?: string; // Filter by registration date (from)

  @IsOptional()
  @IsDateString()
  registrationDateTo?: string; // Filter by registration date (to)

  @IsOptional()
  @IsString()
  sortBy?: string; // e.g., 'nickname', 'registrationDate', 'createdAt'

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
