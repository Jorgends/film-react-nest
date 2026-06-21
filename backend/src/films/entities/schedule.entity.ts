import { Film } from '../../films/entities/films.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({
  name: 'schedules',
})
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('float')
  price: number;

  @Column('simple-array')
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  film?: Film;
}
