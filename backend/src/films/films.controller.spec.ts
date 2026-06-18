import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getAll: jest.fn(),
        getScheduleToId: jest.fn(),
      })
      .compile();

    filmsController = moduleRef.get<FilmsController>(FilmsController);
    filmsService = moduleRef.get<FilmsService>(FilmsService);
  });

  it('.getAll() should call create method of the service', () => {
    filmsController.findAll();

    expect(filmsService.getAll).toHaveBeenCalledWith();
  });

  it('.getAll() should call getAll method of the service', () => {
    const id = 'TEST_ID';
    filmsController.findToId(id);

    expect(filmsService.getScheduleToId).toHaveBeenCalled();
  });
});
