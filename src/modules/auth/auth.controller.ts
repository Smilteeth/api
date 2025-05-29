import { Context } from 'hono';
import { LogInData, UserTableTypes } from './auth.types';
import { HTTPException } from 'hono/http-exception';
import { ServiceFactory } from '../../core/service.factory';
import { AuthService } from './auth.service';

export class AuthController {
	private authService: AuthService;

	constructor(c: Context) {
		this.authService = new ServiceFactory(c).createService('auth');
	}

	async signUp(c: Context) {
		const data: Omit<UserTableTypes, 'userId'> = await c.req.json();

		if (!this.isValidUserData(data, 'signup')) {
			throw new HTTPException(400, { message: 'Missing attribute' });
		}

		await this.authService.create(data);

		return c.json({ message: 'User created' }, 201);
	}

	async logIn(c: Context) {
		const data: LogInData = await c.req.json();

		if (!this.isValidUserData(data, 'login')) {
			throw new HTTPException(400, { message: 'Missing attribute' });
		}

		const { token, exp, type } = await this.authService.findIdByEmail(data);

		return c.json(
			{
				token: token,
				expiration: exp,
				userType: type
			},
			202
		);
	}

	private isValidUserData(data: Partial<UserTableTypes>, mode: 'signup' | 'login'): boolean {
		const fieldSets = {
			signup: ['name', 'lastName', 'birthDate', 'email', 'password', 'type'],
			login: ['email', 'password']
		};

		const requiredFields = fieldSets[mode] as Array<keyof UserTableTypes>;
		return requiredFields.every((field) => Boolean(data[field]));
	}
}
