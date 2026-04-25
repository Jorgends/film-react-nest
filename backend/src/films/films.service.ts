import { Injectable, NotFoundException } from '@nestjs/common';
import { AppRepository } from 'src/repository/appRepository';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly rep: AppRepository) {}

  async getAll(): Promise<FilmDto[]> {
    return this.rep.getFilms();
  }

  async getScheduleToId(id: string): Promise<ScheduleDto[]> {
    const film = await this.rep.getFilmById(id);

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }

    return film.schedule;
  }
}
