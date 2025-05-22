import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { AppointmentDao } from './appointment.dao';
import { AppointmentTableTypes } from './appointment.types';

export class AppointmentService {
	private appointmentDao: AppointmentDao;
	private jwtPayload: JwtPayload;

	constructor(dao: AppointmentDao, jwtPayload: JwtPayload) {
		this.appointmentDao = dao;
		this.jwtPayload = jwtPayload;
	}

	async create(data: Omit<AppointmentTableTypes, 'appointmentId'>) {
		const dentistAppointments = await this.fetchByUserId(data.dentistId!);

		console.log(dentistAppointments);

		if (dentistAppointments.some((appointment) => appointment.appointmentDatetime === data.appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Datetime occupied' });
		}

		await this.appointmentDao.create({ ...data, fatherId: this.jwtPayload.userId });
	}

	async fetchByUserId(
		userId?: number
	): Promise<Array<Omit<AppointmentTableTypes, 'creationDate' | 'lastModificationDate'>>> {
		if (!userId) {
			userId = this.jwtPayload.userId;
		}

		const appointments = await this.appointmentDao.fetchByUserId(userId);

		if (!appointments) {
			throw new HTTPException(404, { message: "User doesn't have appointments" });
		}

		return appointments;
	}
}
