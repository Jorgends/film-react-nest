import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppRepository } from '../repository/appRepository';
import { NewOrderDTO, PostOrderTicketDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly rep: AppRepository) {}

  async newOrders(body: PostOrderTicketDTO[]): Promise<NewOrderDTO> {
    const resultTickets = [];

    for (const ticket of body) {
      const film = await this.rep.getFilmById(ticket.film);
      if (!film) {
        throw new NotFoundException(`Film not found`);
      }

      const schedule = film.schedule.find((s) => s.id == ticket.session);

      if (!schedule) {
        throw new NotFoundException(`Session not found`);
      }

      const place = `${ticket.row}:${ticket.seat}`;

      console.log(place);

      if (schedule.taken.includes(place)) {
        throw new ConflictException(`Seat ${place} already taken`);
      }

      schedule.taken.push(place);

      console.log('Данные для поиска:', {
        film: ticket.film,
        session: ticket.session,
        place,
      });

      const updatedFilm = await this.rep.updateFilmSchedule(
        ticket.film,
        ticket.session,
        place,
      );

      if (!updatedFilm) {
        throw new BadRequestException('Место уже занято или сеанс не найден');
      }

      resultTickets.push({
        ...ticket,
        taken: schedule.taken,
      });
    }

    return {
      total: resultTickets.length,
      items: resultTickets,
    };
  }
}
