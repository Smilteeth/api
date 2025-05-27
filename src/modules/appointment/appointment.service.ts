import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { AppointmentDao } from './appointment.dao';
import { AppointmentTableTypes, RescheduledAppointmentData } from './appointment.types';

export class AppointmentService {
	private appointmentDao: AppointmentDao;
	private jwtPayload: JwtPayload;

	constructor(dao: AppointmentDao, jwtPayload: JwtPayload) {
		this.appointmentDao = dao;
		this.jwtPayload = jwtPayload;
	}

	async create(data: Omit<AppointmentTableTypes, 'appointmentId'>) {
		this.checkDentistAppointments(data.dentistId!, data.appointmentDatetime);
		await this.appointmentDao.create({ ...data, fatherId: this.jwtPayload.userId });
	}

	async fetchByUserId(
		userId?: number
	): Promise<Array<Omit<AppointmentTableTypes, 'creationDate' | 'lastModificationDate'>>> {
		userId ??= this.jwtPayload.userId;

		const appointments = await this.appointmentDao.fetchUserAppointments(userId);

		if (!appointments) {
			throw new HTTPException(404, { message: "User doesn't have appointments" });
		}

		return appointments;
	}

	async fetchById(appointmentId: number): Promise<Omit<AppointmentTableTypes, 'lastModificationDate' | 'creationDate'>> {
		if (!appointmentId) {
			throw new HTTPException(404, { message: 'Appointnment no found' });
		}

		const appointmentData = await this.appointmentDao.fetchById(appointmentId);

		if (!appointmentData) {
			throw new HTTPException(404, { message: 'Appointnment no found' });
		}

		return appointmentData;
	}

	async rescheduledDate(data: RescheduledAppointmentData & Omit<AppointmentTableTypes, 'appointmentId'>) {
		const date = this.appointmentDao.fetchById(data.appointmentId);

		if (!date) {
			throw new HTTPException(404, { message: 'Appointnment not found' });
		}

		this.checkDentistAppointments(data.dentistId!, data.appointmentDatetime);

		await this.appointmentDao.deleteById({
			id: data.appointmentId,
			dateModified: new Date().toISOString().replace('T', ' ').replace('Z', '')
		});

		await this.appointmentDao.addToRescheduled({
			appointmentId: data.appointmentId,
			rescheduleReason: data.rescheduleReason,
			rescheduledDate: data.rescheduledDate
		});

		await this.appointmentDao.create({
			fatherId: this.jwtPayload.userId,
			dentistId: data.dentistId,
			reason: data.reason,
			childId: data.childId,
			appointmentDatetime: data.appointmentDatetime
		});
	}

	private async checkDentistAppointments(dentistId: number, appointmentDatetime: string) {
		const dentistAppointments = await this.fetchByUserId(dentistId);

		if (dentistAppointments.some((appointment) => appointment.appointmentDatetime === appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Datetime occupied' });
		}
	}
}
