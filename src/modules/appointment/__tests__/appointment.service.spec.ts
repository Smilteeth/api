import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppointmentDao } from '../appointment.dao';
import { AppointmentService } from '../appointment.service';
import { JwtPayload } from '../../../types/payload.type';
import { DateStatus, DateValidator } from '../../../utils/DateValidator';
import { AppointmentData } from '../appointment.types';
import { Pagination } from '../../../utils/pagination';

const daoMocks = {
	fetchUserAppointments: vi.fn(),
	fetchById: vi.fn(),
	create: vi.fn(),
	deactivate: vi.fn()
};

// Manual mock
const MockAppointmentDao = {
	fetchUserAppointments: daoMocks.fetchUserAppointments,
	fetchById: daoMocks.fetchById,
	create: daoMocks.create,
	deactivateAppointment: daoMocks.deactivate
} as unknown as AppointmentDao;

describe('Tests for Appointment Service', () => {
	let service: AppointmentService;
	let mockJwtPayload: JwtPayload;

	beforeEach(() => {
		mockJwtPayload = { userId: 1, type: 'FATHER', exp: 1749741919 };
		service = new AppointmentService(MockAppointmentDao, mockJwtPayload);

		// Cleans between tests
		vi.clearAllMocks();
	});

	describe('Create', () => {
		it('Successful creation', async () => {
			const data = {
				childId: 2,
				dentistId: 3,
				fatherId: 2,
				reason: 'Dolor de muela',
				appointmentDatetime: '2025-07-01 12:00:00'
			};

			daoMocks.fetchUserAppointments.mockResolvedValue([]);
			daoMocks.create.mockResolvedValue(undefined);

			const validator = new DateValidator();

			vi.spyOn(validator, 'validFormat').mockReturnValue(true);
			vi.spyOn(validator, 'userIsAvailable').mockReturnValue(true);
			vi.spyOn(validator, 'isAppointmentDate').mockReturnValue(DateStatus.Future);

			await expect(service.create(data)).resolves.toBeUndefined();

			expect(daoMocks.fetchUserAppointments).toBeCalledTimes(2);
		});
	});

	describe('Fetch Appointments', () => {
		it('Successful fetch', async () => {
			const fakeAppointments: Array<AppointmentData> = [
				{
					appointmentId: 1,
					dentistId: 2,
					fatherId: 3,
					childId: 1,
					reason: 'Dolor de muela',
					appointmentDatetime: '2025-05-30 07:00:00',
					creationDate: '2025-05-29',
					lastModificationDate: null,
					isActive: false,
					childName: 'Jhon',
					childLastname: 'Doe'
				}
			];

			daoMocks.fetchUserAppointments.mockResolvedValue(fakeAppointments);

			const pagination = new Pagination();

			vi.spyOn(pagination, 'generate').mockReturnValue({
				page: 1,
				limit: 10,
				totalPages: 1,
				items: fakeAppointments
			});

			const result = await service.fetchUserAppointments(1, 10);
			expect(result.items.length).toBe(1);
		});
	});

	describe('Fetch Appointment By Id', () => {
		it('Successful fetch', async () => {
			const fakeAppointment: AppointmentData = {
				appointmentId: 1,
				dentistId: 2,
				fatherId: 1,
				childId: 1,
				reason: 'Dolor de muela',
				appointmentDatetime: '2025-05-30 07:00:00',
				creationDate: '2025-05-29',
				lastModificationDate: null,
				isActive: false,
				childName: 'Jhon',
				childLastname: 'Doe'
			};

			daoMocks.fetchById.mockResolvedValue(fakeAppointment);

			await expect(service.fetchById(fakeAppointment.appointmentId)).resolves.eq(fakeAppointment);
		});
	});

	describe('Deactivate appointment', () => {
		it('Successful deactivation', async () => {
			const data: { deactiveAppointmentId: number; reason: string; type: 'CANCELLED' | 'FINISHED' | 'RESCHEDULED' } = {
				deactiveAppointmentId: 2,
				reason: 'Falta tiempo',
				type: 'RESCHEDULED'
			};

			vi.spyOn(service, 'validateAppointment').mockResolvedValue({ result: true, message: 'Valid Appointment' });

			await expect(service.deactiveAppointment(data)).resolves.toBeUndefined();
		});
	});
});
