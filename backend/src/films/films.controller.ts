import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from '../films/films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<{ items: FilmDto[] }> {
    const films = await this.filmsService.getAll();
    return { items: films };
  }

  @Get(':id/schedule')
  async findToId(@Param('id') id: string): Promise<{ items: ScheduleDto[] }> {
    const schedule = await this.filmsService.getScheduleToId(id);
    return { items: schedule };
  }
}
