import { HTTPException } from 'hono/http-exception';
import { hashPassword } from '../../utils/hashPassword';
import { AuthDao } from './auth.dao';
import { LogInData, UserTableTypes } from './auth.types';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { JwtUtil } from '../../utils/generateJwt';
import { Validator } from '../../utils/validator';
import { is } from 'drizzle-orm';

export class AuthService {
	private authDao: AuthDao;
	private jwtUtil: JwtUtil;

	constructor(authDao: AuthDao, secret: SignatureKey) {
		this.authDao = authDao;

		this.jwtUtil = new JwtUtil(secret);
	}

	async create(data: Omit<UserTableTypes, 'userId'>): Promise<void> {
		try {
			const password = await hashPassword(data.password);

			await this.authDao.create({ ...data, password });
		} catch (error) {
			throw error;
		}
	}

	async findIdByEmail(data: LogInData): Promise<{ token: string; exp: number }> {
		try {
			const user = await this.authDao.findIdByEmail(data.email);

			if (!user) {
				throw new HTTPException(404, { message: 'User not found' });
			}

            const isValid = await new Validator().password(data.password, user.password);

			if (!isValid) {
				throw new HTTPException(401, { message: 'Invalid password' });
			}

			const { userId, type } = user;

			const { token, exp } = await this.jwtUtil.generateJwt(userId, type);

			return { token, exp };
		} catch (error) {
			throw error;
		}
	}
}
