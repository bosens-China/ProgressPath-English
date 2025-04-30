import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FindCoursesQueryDto {
  @IsOptional()
  @IsNumberString()
  current?: string = '1'; // Default page 1

  @IsOptional()
  @IsNumberString()
  pageSize?: string = '10'; // Default size 10

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  isPublished?: string; // Use string for query param, transform later
}

// Helper function to parse number string
export function parseNumber(
  value: string | undefined,
  defaultValue: number,
): number {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
