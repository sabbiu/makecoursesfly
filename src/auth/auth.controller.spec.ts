import { TestingModule, Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

const mockAuthRegisterDto: AuthRegisterDto = {
  name: 'Test',
  username: 'Test',
  password: 'Test',
  email: 'test@test.com',
};

const mockAuthLoginDto: AuthLoginDto = {
  username: 'test',
  password: 'test',
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest
              .fn()
              .mockImplementation((authDto: AuthRegisterDto) =>
                Promise.resolve({ accessToken: 'some token' })
              ),
            login: jest
              .fn()
              .mockImplementation((authDto: AuthLoginDto) =>
                Promise.resolve({ accessToken: 'some token' })
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', () => {
      expect(controller.register(mockAuthRegisterDto)).resolves.toEqual({
        accessToken: 'some token',
      });
    });
  });

  describe('login', () => {
    it('should login a user', () => {
      expect(controller.login(mockAuthLoginDto)).resolves.toEqual({
        accessToken: 'some token',
      });
    });
  });
});
