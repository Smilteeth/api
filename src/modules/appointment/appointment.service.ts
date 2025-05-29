import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { AppointmentDao } from './appointment.dao';
import { AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { DateValidator } from '../../utils/DateValidator';
import { pagination, PaginationType } from '../../utils/pagination';

export class AppointmentService {
	private appointmentDao: AppointmentDao;
	private jwtPayload: JwtPayload;
	private dateValidator: DateValidator;

	constructor(dao: AppointmentDao, jwtPayload: JwtPayload) {
		this.appointmentDao = dao;
		this.jwtPayload = jwtPayload;
		this.dateValidator = new DateValidator();
	}

	async create(data: Omit<AppointmentTableTypes, 'appointmentId'>) {
		this.dateValidator.validFormat(data.appointmentDatetime);

		const [dentistAppointments, childAppointments] = await Promise.all([
			this.appointmentDao.fetchUserAppointments(data.dentistId!),
			this.appointmentDao.fetchUserAppointments(data.childId!)
		]);

		this.dateValidator.userIsAvailable(dentistAppointments, data.appointmentDatetime);

		this.dateValidator.userIsAvailable(childAppointments, data.appointmentDatetime);

		if (this.dateValidator.isAppointmentDate(data.appointmentDatetime) !== 'future') {
			throw new HTTPException(409, { message: 'Appointments can only be scheduled for a future date.' });
		}

		await this.appointmentDao.create({ ...data, fatherId: this.jwtPayload.userId });
	}

	async fetchUserAppointments(
		page: number,
		limit: number
	): Promise<PaginationType<Omit<AppointmentTableTypes, 'lastModificationDate'>>> {
		const appointments = await this.appointmentDao.fetchUserAppointments(this.jwtPayload.userId);

		if (!appointments) {
			throw new HTTPException(404, { message: "User doesn't have appointments" });
		}

		return pagination<Omit<AppointmentTableTypes, 'lastModificationDate'>>(appointments, page, limit);
	}

	async fetchById(appointmentId: number): Promise<Omit<AppointmentTableTypes, 'lastModificationDate'>> {
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
		await this.validateAppointment(data.deactiveAppointmentId);

		await this.appointmentDao.deactivateAppointment(data);
	}

	private async validateAppointment(appointmentId: number) {
		const appointment = await this.appointmentDao.fetchById(appointmentId);

		if (!appointment) {
			throw new HTTPException(404, { message: 'Appointment not found' });
		}

		if (!appointment.isActive) {
			throw new HTTPException(401, { message: 'Appointment already deactivated' });
		}

		if (!this.dateValidator.appointmentCanBeInactivated(appointment.creationDate!)) {
			throw new HTTPException(409, {
				message: "Appointnments only can be cancelled or rescheduled if 24 hours haven't passed from the creation"
			});
		}

		if (this.dateValidator.isAppointmentDate(appointment.appointmentDatetime) !== 'future') {
			throw new HTTPException(409, { message: 'Only future appointments can be cancelled or rescheduled' });
		}
	}
}
