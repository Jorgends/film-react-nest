import { Film } from './film.model';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

function toScheduleDto(schedule: ScheduleDto): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken,
  };
}

function toFilmDto(film: FilmDto): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
    schedule: film.schedule.map(toScheduleDto),
  };
}

export class AppRepository {
  constructor(@InjectModel('Film') private filmModel: Model<Film>) {}

  async getFilms(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();
    return films.map(toFilmDto);
  }

  async getFilmById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).lean();
    return film ? toFilmDto(film) : null;
  }

  async updateFilmSchedule(filmId: string, scheduleId: string, place: string) {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': scheduleId,
      },
      {
        $push: { 'schedule.$.taken': place },
      },
    );

    return result;
  }
}
