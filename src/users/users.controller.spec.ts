import { UsersController } from './users.controller';
import { TestingModule, Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';

const mockUser = {
  _id: 'uuid',
  username: 'test',
  photo: 'http://example.com',
  name: 'Test',
  email: 'test@test.com',
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest
              .fn()
              .mockImplementation(() => Promise.resolve([mockUser])),
            getUser: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockUser)),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('returns user', () => {
      const result = controller.me(mockUser as any);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should return a user', () => {
      expect(controller.getUser('test')).resolves.toEqual(mockUser);
    });
  });

  describe('getUsers', () => {
    it('should return list of users', () => {
      expect(controller.getUsers({} as any)).resolves.toEqual([mockUser]);
    });
  });
});
