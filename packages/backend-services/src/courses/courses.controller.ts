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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FindCoursesQueryDto } from './dto/find-courses-query.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCourseDto: CreateCourseDto) {
    // Ensure only admins can create? Add specific guard if needed.
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAllPaginated(@Query() query: FindCoursesQueryDto) {
    // Ensure only admins can list all? Add specific guard if needed.
    return this.coursesService.findAllPaginated(query);
  }

  // Get all courses without pagination
  @Get('all')
  findAll() {
    // Ensure only admins can list all? Add specific guard if needed.
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Public access maybe? If not, add guard.
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    // Ensure only admins can update? Add specific guard if needed.
    return this.coursesService.update(id, updateCourseDto);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    // Ensure only admins can deactivate? Add specific guard if needed.
    return this.coursesService.deactivate(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  activate(@Param('id', ParseIntPipe) id: number) {
    // Ensure only admins can activate? Add specific guard if needed.
    return this.coursesService.activate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    // Ensure only admins can delete? Add specific guard if needed.
    // Use with caution - consider deactivation first.
    return this.coursesService.remove(id);
  }
}
