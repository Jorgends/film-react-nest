import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { NewOrderDTO, PostOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async postOrder(@Body() body: PostOrderDTO): Promise<NewOrderDTO> {
    const orders = await this.orderService.newOrders(body.tickets);

    return {
      total: orders.total,
      items: orders.items,
    };
  }
}
