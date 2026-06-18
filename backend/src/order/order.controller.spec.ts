import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PostOrderDTO } from './dto/order.dto';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        newOrders: jest.fn().mockResolvedValue({
          total: 2,
          items: [
            {
              time: '18:30',
              day: '2026-06-12',
              daytime: 'evening',
              film: 'film-1',
              session: 'session-1',
              row: 5,
              seat: 8,
              price: 2500,
            },
            {
              time: '21:00',
              day: '2026-06-12',
              daytime: 'night',
              film: 'film-2',
              session: 'session-2',
              row: 3,
              seat: 12,
              price: 3000,
            },
          ],
        }),
      })
      .compile();

    orderController = moduleRef.get<OrderController>(OrderController);
    orderService = moduleRef.get<OrderService>(OrderService);
  });

  it('.newOrders() should call create method of the service', async () => {
    const mockOrder: PostOrderDTO = {
      email: 'test@example.com',
      phone: '+77001234567',
      tickets: [
        {
          time: '18:30',
          day: '2026-06-12',
          daytime: 'evening',
          film: 'film-1',
          session: 'session-1',
          row: 5,
          seat: 8,
          price: 2500,
        },
        {
          time: '21:00',
          day: '2026-06-12',
          daytime: 'night',
          film: 'film-2',
          session: 'session-2',
          row: 3,
          seat: 12,
          price: 3000,
        },
      ],
    };

    const result = await orderController.postOrder(mockOrder);
    
    expect(orderService.newOrders).toHaveBeenCalledWith(mockOrder.tickets);
    expect(result.total).toBe(2);
    expect(Array.isArray(result.items)).toBe(true);
  });
});
