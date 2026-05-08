import { Module } from '@nestjs/common';
import { AppRepository } from './appRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema } from './film.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }])],
  providers: [AppRepository],
  exports: [AppRepository],
})
export class RepositoryModule {}
