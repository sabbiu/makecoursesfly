import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDoc } from './interfaces/user-document.interface';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { GetUsersFilterDto } from 'src/users/dto/get-users-filter.dto';

const mockManualUser = {
  name: 'Test',
  username: 'Test',
  password: 'Test',
  email: 'test@test.com',
  photo: 'https://example.com',
};

const mockSocialUser = {
  name: 'Test',
  username: 'test',
  googleId: 'uuid',
  id: 'some uuid',
  photo: 'https://example.com',
};

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

const mockGoogleProfile = {
  id: 'uuid',
  _json: {
    name: 'Test',
    given_name: 'Test',
    email: 'test@test.com',
    picture: 'https://example.com',
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<UserDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            aggregate: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<UserDoc>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('successfully returns tag, on found', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockManualUser as any]);
      await expect(service.getUser('username')).resolves.not.toThrow();
    });

    it('throws NotFoundException, on error', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([]);
      await expect(service.getUser('username')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getUsers', () => {
    it('returns list of tags along with offset, limit and count', async () => {
      const params = {
        search: 'text',
        limit: 10,
        offset: 0,
      } as GetUsersFilterDto;
      jest
        .spyOn(model, 'aggregate')
        .mockResolvedValue([mockManualUser, mockManualUser]);
      jest.spyOn(model, 'countDocuments').mockResolvedValue(2);

      await expect(service.getUsers(params)).resolves.not.toThrow();
      const result = await service.getUsers(params);
      expect(result).toEqual({
        data: [mockManualUser, mockManualUser],
        offset: params.offset,
        limit: params.limit,
        count: 2,
      });
    });
  });

  describe('register', () => {
    it('successfully registers the user', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockManualUser as any);
      await expect(
        service.register(mockAuthRegisterDto)
      ).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', async () => {
      jest.spyOn(model, 'create').mockRejectedValue({
        errors: { username: { properties: { message: 'conflict' } } },
        name: 'ValidationError',
      });
      await expect(service.register(mockAuthRegisterDto)).rejects.toThrow(
        ConflictException
      );
    });

    it('throws a internal server error exception', async () => {
      jest.spyOn(model, 'create').mockRejectedValue('error');
      await expect(service.register(mockAuthRegisterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('login', () => {
    describe('user is found', () => {
      let user: any;

      beforeEach(() => {
        user = mockManualUser;
        user.validatePassword = jest.fn();
        jest.spyOn(model, 'findOne').mockResolvedValue(user);
      });

      it('successfully validates user', async () => {
        user.validatePassword.mockResolvedValue(true);
        await expect(service.login(mockAuthLoginDto)).resolves.not.toThrow();
      });

      it('returns UnauthorizedException as password cannot be validated', async () => {
        user.validatePassword.mockResolvedValue(false);
        await expect(service.login(mockAuthLoginDto)).rejects.toThrow(
          UnauthorizedException
        );
      });
    });

    describe('user with username is not found', () => {
      it('returns UnauthorizedException as username cannot be found', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValue(null);
        await expect(service.login(mockAuthLoginDto)).rejects.toThrow(
          UnauthorizedException
        );
      });
    });

    describe('social user', () => {
      it('rejects login of user without password and throws unauthorized exception', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValue(mockSocialUser as any);
        await expect(service.login(mockAuthLoginDto)).rejects.toThrow(
          UnauthorizedException
        );
      });
    });
  });

  describe('validateOAuthGoogleLogin', () => {
    it('successfully creates a user', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockManualUser as any);
      await expect(
        service.validateOAuthGoogleLogin(mockGoogleProfile)
      ).resolves.not.toThrow();
    });

    // not checking rejection, as it has already been tested in register block
  });
});
