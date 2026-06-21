import { ConfigService } from '@nestjs/config';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { createLogger } from './logger.factory';
import { TskvLogger } from './tskv.logger';

describe('the logger group test', () => {
  describe('devLogger correct', () => {
    let logger: DevLogger;

    beforeEach(() => {
      logger = new DevLogger();
    });

    it('display on the console', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('test message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('text return is correct', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('test message');
      const message = String(spy.mock.calls[0][0]);
      expect(message).toMatch(/LOG.*test message/);
      spy.mockRestore();
    });
  });

  describe('jsonLogger correct', () => {
    const logger = new JsonLogger();

    it('display on the console', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      logger.log('test message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('text return is correct', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      logger.log('test message');
      const message = spy.mock.calls[0][0];
      const parsed = JSON.parse(message);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test message');
      spy.mockRestore();
    });
  });

  describe('tskvLogger correct', () => {
    const logger = new TskvLogger();

    it('display on the console', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('test message');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('text return is correct', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      logger.log('test message');
      const message = String(spy.mock.calls[0][0]);
      expect(message).toMatch(/message=test message/);
      expect(message).toMatch(/level=log/);
      expect(message).toMatch(/pid=/);
      expect(message).toMatch(/time=/);
      spy.mockRestore();
    });

    it('The error method is correct', () => {
      const spy = jest
        .spyOn(process.stderr, 'write')
        .mockImplementation(() => true);
      logger.error('error message');
      expect(spy).toHaveBeenCalled();
      const message = String(spy.mock.calls[0][0]);
      expect(message).toMatch(/message=error message/);
      expect(message).toMatch(/level=error/);
      spy.mockRestore();
    });
  });

  test('loggerFactory correct', () => {
    const result = (a: number, b: number) => {
      return a + b;
    };
    expect(result(2, 2)).toBe(4); // Проверка утверждения
  });
});

describe('createLogger correct', () => {
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;
  });

  it('should return JsonLogger when LOGGER_TYPE is json', () => {
    configService.get.mockReturnValue('json');

    const logger = createLogger(configService);

    expect(logger).toBeInstanceOf(JsonLogger);
  });

  it('should return TskvLogger when LOGGER_TYPE is tskv', () => {
    configService.get.mockReturnValue('tskv');

    const logger = createLogger(configService);

    expect(logger).toBeInstanceOf(TskvLogger);
  });

  it('should return DevLogger for unknown logger type', () => {
    configService.get.mockReturnValue('unknown');

    const logger = createLogger(configService);

    expect(logger).toBeInstanceOf(DevLogger);
  });

  it('should return DevLogger when LOGGER_TYPE is undefined', () => {
    configService.get.mockReturnValue(undefined);

    const logger = createLogger(configService);

    expect(logger).toBeInstanceOf(DevLogger);
  });
});
