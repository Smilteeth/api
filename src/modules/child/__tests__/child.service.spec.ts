import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChildDao } from '../child.dao';
import { ChildService } from '../child.service';
import { JwtPayload } from '../../../types/payload.type';
import { ChildData, ChildReturnType, ChildTableTypes } from '../child.types';
import { Pagination } from '../../../utils/pagination';

const daoMocks = {
  fetchUserChilds: vi.fn(),
  fetchById: vi.fn(),
  create: vi.fn()
};

const MockChildDao = {
  fetchUserChilds: daoMocks.fetchUserChilds,
  fetchById: daoMocks.fetchById,
  create: daoMocks.create
} as unknown as ChildDao;

describe('Tests for Child Service', () => {
  let service: ChildService;
  let mockJwtPayload: JwtPayload;

  beforeEach(() => {
    mockJwtPayload = { userId: 1, type: 'FATHER', exp: 1749741919 };

    service = new ChildService(MockChildDao, mockJwtPayload);

    vi.clearAllMocks();
  });

  describe('Create', () => {
    it('Successful creation', async () => {
      const data: ChildData = {
        name: 'Jhon',
        lastName: 'Doe',
        dentistId: 3,
        gender: 'M',
        birthDate: '2020-07-01 12:00:00',
        morningBrushingTime: '7:00',
        afternoonBrushingTime: '14:00',
        nightBrushingTime: '20:00',
      };

      await expect(service.create(data)).resolves.toBeUndefined();
    });
  });

  describe('Fetch Childs', () => {
    it('Successful fetch', async () => {
      const fakeChilds: Array<ChildReturnType> = [{
        childId: 10,
        fatherId: 3,
        father: "Jair Lopez",
        dentistId: 2,
        dentist: "Dr. Sinue Lopez",
        name: "Jey",
        lastName: "Due",
        gender: "F",
        birthDate: "2005-03-03 00:00:00",
        morningBrushingTime: "7:00",
        afternoonBrushingTime: "15:00",
        nightBrushingTime: "20:00",
        creationDate: "2025-06-02",
        isActive: true
      }];

      daoMocks.fetchUserChilds.mockResolvedValue(fakeChilds);

      const pagination = new Pagination();

      vi.spyOn(pagination, 'generate').mockReturnValue({

        page: 1,
        limit: 10,
        totalPages: 1,
        items: fakeChilds
      });

      const result = await service.fetchUserChilds(1, 10);

      expect(result.items.length).toBe(1);

    });
  });

  describe('Fetch Child', () => {
    it('Successful fetch', async () => {
      const fakeChild: ChildReturnType = {
        childId: 2,
        fatherId: 1,
        father: "Jair Lopez",
        dentistId: 2,
        dentist: "Dr. Sinue Lopez",
        name: "Jey",
        lastName: "Due",
        gender: "F",
        birthDate: "2005-03-03 00:00:00",
        morningBrushingTime: "7:00",
        afternoonBrushingTime: "15:00",
        nightBrushingTime: "20:00",
        creationDate: "2025-06-02",
        isActive: true
      }
      daoMocks.fetchById.mockResolvedValue(fakeChild);

      await expect(service.fetchById(fakeChild.childId)).resolves.eq(fakeChild);
    });

  });
});
