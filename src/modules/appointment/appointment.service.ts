import { JwtPayload } from '../../types/payload.type';
import { AppointmentDao } from './appointment.dao';
import { AppointmentData, AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { DateValidator } from '../../utils/DateValidator';
import { Pagination, PaginationType } from '../../utils/pagination';
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export class AppointmentService {
	private appointmentDao: AppointmentDao;
	private jwtPayload: JwtPayload;
	private dateValidator: DateValidator;
	private pagination: Pagination;

	constructor(dao: AppointmentDao, jwtPayload: JwtPayload) {
		this.appointmentDao = dao;
		this.jwtPayload = jwtPayload;
		this.dateValidator = new DateValidator();
		this.pagination = new Pagination();
	}

	async create(
		data: Omit<AppointmentTableTypes, 'appointmentId' | 'lastModificationDate' | 'isActive' | 'creationDate'>
	) {
		if (!this.dateValidator.validFormat(data.appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Invalid datetime format' });
		}

		const [dentistAppointments, childAppointments] = await Promise.all([
			this.appointmentDao.fetchUserAppointments(data.dentistId!),
			this.appointmentDao.fetchUserAppointments(data.childId!)
		]);

		if (!this.dateValidator.userIsAvailable(dentistAppointments, data.appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Dentist occupied' });
		}

		if (!this.dateValidator.userIsAvailable(childAppointments, data.appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Child already has an appointment for that datetime' });
		}

		if (this.dateValidator.isAppointmentDate(data.appointmentDatetime) !== 'future') {
			throw new HTTPException(409, { message: 'Appointments can only be scheduled for a future date.' });
		}

		await this.appointmentDao.create({ ...data, fatherId: this.jwtPayload.userId });
	}

	async fetchUserAppointments(
		page: number,
		limit: number
	): Promise<PaginationType<Omit<AppointmentData, 'lastModificationDate'>>> {
		const appointments = await this.appointmentDao.fetchUserAppointments(this.jwtPayload.userId);

		if (!appointments) {
			throw new HTTPException(404, { message: "User doesn't have appointments" });
		}

		return this.pagination.generate<Omit<AppointmentData, 'lastModificationDate'>>(appointments, page, limit);
	}

	async fetchById(appointmentId: number): Promise<Omit<AppointmentData, 'lastModificationDate'>> {
		if (!appointmentId) {
			throw new HTTPException(404, { message: 'Appointment no found' });
		}

		const appointmentData = await this.appointmentDao.fetchById(appointmentId);

		if (!appointmentData) {
			throw new HTTPException(404, { message: 'Appointment not found' });
		}

		if (appointmentData.fatherId !== this.jwtPayload.userId && appointmentData.dentistId !== this.jwtPayload.userId) {
			throw new HTTPException(401, { message: 'The appointment does not belong to the user' });
		}

		return appointmentData;
	}

	// operations with inactive appointment
	async deactiveAppointment(data: Omit<DeactiveAppointmentTableTypes, 'deactivationDate'>) {
		const validateAppointment = await this.validateAppointment(data.deactiveAppointmentId);

		if (!validateAppointment.result) {
			throw new HTTPException(validateAppointment.errorCode, { message: validateAppointment.message });
		}

		await this.appointmentDao.deactivateAppointment(data);
	}

	async validateAppointment(
		appointmentId: number
	): Promise<{ result: boolean; message: string; errorCode?: ContentfulStatusCode }> {
		const appointment = await this.appointmentDao.fetchById(appointmentId);

		if (!appointment) {
			return { result: false, message: 'Appointment not found', errorCode: 404 };
		}

		if (!appointment.isActive) {
			return { result: false, message: 'Appointment already deactivated', errorCode: 401 };
		}

		if (!this.dateValidator.appointmentCanBeInactivated(appointment.creationDate!)) {
			return {
				result: false,
				message: "Appointnments only can be cancelled or rescheduled if 24 hours haven't passed from the creation",
				errorCode: 409
			};
		}

		if (this.dateValidator.isAppointmentDate(appointment.appointmentDatetime) !== 'future') {
			return { result: false, message: 'Only future appointments can be cancelled or rescheduled', errorCode: 409 };
		}

		return { result: true, message: 'Valid appointment' };
	}
}
