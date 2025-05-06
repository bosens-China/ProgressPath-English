import { PartialType } from '@nestjs/mapped-types';
import { CreatePictureBedDto } from './create-picture-bed.dto';

export class UpdatePictureBedDto extends PartialType(CreatePictureBedDto) {}
