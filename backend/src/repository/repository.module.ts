import { Module } from '@nestjs/common';
import { AppRepository } from './appRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/films/entities/schedule.entity';
import { Film } from 'src/films/entities/films.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [AppRepository],
  exports: [AppRepository],
})
export class RepositoryModule {}
