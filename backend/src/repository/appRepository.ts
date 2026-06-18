// import { Film } from './film.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmDto } from '../films/dto/films.dto';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/films.entity';
import { Schedule } from '../films/entities/schedule.entity';

export class AppRepository {
  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async getFilms(): Promise<Film[]> {
    const films = await this.filmRepository.find();
    return films;
  }

  async getFilmById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film ? film : null;
  }

  async updateFilmSchedule(filmId: string, scheduleId: string, place: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
        film: { id: filmId },
      },
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const current = schedule.taken;

    current.push(place);

    schedule.taken = current;

    await this.scheduleRepository.save(schedule);

    return schedule;
  }
}