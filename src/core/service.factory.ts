import { Context } from 'hono';
import { AuthService } from '../modules/auth/auth.service';
import { DentistService } from '../modules/dentist/dentist.service';
import { DaoFactory } from './dao.factory';
import { AppointmentService } from '../modules/appointment/appointment.service';
import { ChildService } from '../modules/child/child.service';

type ServiceType = 'auth' | 'dentist' | 'appointment' | 'child';

interface ServiceMap {
	auth: AuthService;
	dentist: DentistService;
	appointment: AppointmentService;
	child: ChildService;
}

export class ServiceFactory {
	private serviceCreator: {
		[key in ServiceType]: () => ServiceMap[key];
	};

	constructor(context: Context) {
		const dao = new DaoFactory(context);

		const jwtPayload = context.get('jwtPayload');

		this.serviceCreator = {
			auth: () => new AuthService(dao.createDao('auth'), jwtPayload),
			dentist: () => new DentistService(dao.createDao('dentist'), jwtPayload),
			appointment: () => new AppointmentService(dao.createDao('appointment'), jwtPayload),
			child: () => new ChildService(dao.createDao('child'), jwtPayload)
		};
	}

	createService<T extends ServiceType>(type: T): ServiceMap[T] {
		const service = this.serviceCreator[type];

		if (!service) {
			throw new Error('Invalid type');
		}

		return service();
	}
}
