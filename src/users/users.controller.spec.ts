import { UsersController } from './users.controller';
import { TestingModule, Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('returns user', () => {
      const mockUser = {
        _id: 'uuid',
        username: 'test',
        photo: 'http://example.com',
        name: 'Test',
        email: 'test@test.com',
      };
      const expectedResult = {
        id: 'uuid',
        username: 'test',
        photo: 'http://example.com',
        name: 'Test',
        email: 'test@test.com',
      };
      const result = controller.me(mockUser as any);
      expect(result).toEqual(expectedResult);
    });
  });
});
