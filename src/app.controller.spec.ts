import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getUrlMetadata: jest.fn().mockReturnValue('result'),
          },
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUrlMetadata', () => {
    it('should call getUrlMetadata with given url', () => {
      controller.getUrlMetadata('some url');
      expect(service.getUrlMetadata).toHaveBeenLastCalledWith('some url');
    });

    it('should return result when called', () => {
      expect(controller.getUrlMetadata('some url')).toBe('result');
    });
  });
});
