import { Context } from 'hono';
import { LogInData, UserTableTypes } from './auth.types';
import { HTTPException } from 'hono/http-exception';
import { authServiceFactory } from './auth.service.factory';

export class AuthController {
	async signUp(c: Context) {
		try {
			const data: Omit<UserTableTypes, 'userId'> = await c.req.json();

			if (!this.isValidUserData(data, 'signup')) {
				throw new HTTPException(400, { message: 'Missing attribute' });
			}

			const authService = authServiceFactory(c);
			await authService.create(data);

			return c.json({ message: 'User created' }, 201);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);

			if (error instanceof HTTPException) {
				throw error;
			}


			if (errorMessage.includes('UNIQUE constraint failed: User.email')) {
				throw new HTTPException(400, {
					message: 'Email already in use',
					cause: errorMessage
				});
			}

			throw new HTTPException(500, {
				message: 'Server error',
				cause: errorMessage
			});
		}
	}

	async logIn(c: Context) {
		try {
			const data: LogInData = await c.req.json();

			if (!this.isValidUserData(data, 'login')) {
				throw new HTTPException(400, { message: 'Missing attribute' });
			}

			const authService = authServiceFactory(c);
			const { token, exp } = await authService.findIdByEmail(data);

			return c.json(
				{
					token: token,
					expiration: exp
				},
				200
			);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			if (error instanceof HTTPException) {
				throw error;
			}

			throw new HTTPException(500, {
				message: 'Server error',
				cause: errorMessage
			});
		}
	}

    async logout(c: Context) {
        try {
            
            const authHeader = c.req.header('Authorization')
            
            const token = authHeader?.split(" ")[1];

            return c.json({
                message: token ?? ""
            })
        

        } catch(error){
            const errorMessage = error instanceof Error ? error.message : String(error);

            throw new HTTPException(500, {
                message: 'Server error',
                cause: errorMessage
            });
        }

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
