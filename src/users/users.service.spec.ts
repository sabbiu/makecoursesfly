import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

const mockUser = {
  _id: 'uuid',
  username: 'test',
  photo: 'http://example.com',
  name: 'Test',
  email: 'test@test.com',
};

describe(`UsersService`, () => {
  let service: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AuthService,
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

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', () => {
      expect(service.getUser('test')).resolves.toEqual(mockUser);
    });
  });

  describe('getUsers', () => {
    it('should return list of users', () => {
      expect(service.getUsers({} as any)).resolves.toEqual([mockUser]);
    });
  });
});
