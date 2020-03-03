import { TestingModule, Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { OpinionsController } from './opinions.controller';
import { OpinionsService } from './opinions.service';

const mockOpinion = { _id: 'uuid', text: 'my opinion' };
const mockUser = { _id: 'user uuid' } as any;

describe('OpinionsController', () => {
  let controller: OpinionsController;
  let service: OpinionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [OpinionsController],
      providers: [
        {
          provide: OpinionsService,
          useValue: {
            getMyPostOpinion: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve(mockOpinion)),
            getPostOpinions: jest
              .fn()
              .mockImplementation(() => Promise.resolve([mockOpinion])),
            getOpinions: jest
              .fn()
              .mockImplementation(() => Promise.resolve([mockOpinion])),
            createOpinion: jest
              .fn()
              .mockImplementation(() => Promise.resolve('opinion uuid')),
            updateOpinion: jest
              .fn()
              .mockImplementation(() => Promise.resolve('opinion uuid')),
            deleteOpinion: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    controller = module.get<OpinionsController>(OpinionsController);
    service = module.get<OpinionsService>(OpinionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOpinion', () => {
    const mockCreateTagDto = {} as any;
    it('should return an opinion id', () => {
      expect(
        controller.createOpinion(mockCreateTagDto, mockUser, 'post id')
      ).resolves.toEqual('opinion uuid');
    });

    it(`should call opinionsService's createOpinion function with createOpinionDto, user and postId`, () => {
      controller.createOpinion(mockOpinion, mockUser, 'post id');
      expect(service.createOpinion).toBeCalledWith(
        mockOpinion,
        'post id',
        mockUser
      );
    });
  });

  describe('updateOpinion', () => {
    it('should return opinion id, when updated', () => {
      expect(
        controller.updateOpinion('opinion uuid', mockOpinion)
      ).resolves.toEqual('opinion uuid');
    });

    it(`should call opinionsService's updateOpinion function with id and updateBody`, () => {
      controller.updateOpinion('opinion uuid', mockOpinion);
      expect(service.updateOpinion).toBeCalledWith('opinion uuid', mockOpinion);
    });
  });

  describe('deleteOpinion', () => {
    it(`should call opinionsService's deleteOpinion with id`, () => {
      controller.deleteOpinion('opinion uuid');
      expect(service.deleteOpinion).toBeCalledWith('opinion uuid');
    });
  });

  describe('getPostOpinions', () => {
    const filterDto = { search: 'asdf' } as any;
    it(`should call opinionsService's getPostOpinions with filters, postId, user`, () => {
      controller.getPostOpinions(filterDto, 'post id', mockUser);
      expect(service.getPostOpinions).toBeCalledWith(
        filterDto,
        'post id',
        mockUser
      );
    });
  });

  describe('getOpinions', () => {
    const filterDto = { search: 'asdf' } as any;
    it(`should call opinionsService's getOpinions with filters`, () => {
      controller.getOpinions(filterDto);
      expect(service.getOpinions).toBeCalledWith(filterDto);
    });
  });

  describe('getMyPostOpinion', () => {
    it(`should call opinionsService's getMyPostOpinion with postId and user`, () => {
      controller.getMyPostOpinion(mockUser, 'post id');
      expect(service.getMyPostOpinion).toBeCalledWith('post id', mockUser);
    });
  });
});
