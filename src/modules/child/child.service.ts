import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { ChildDao } from './child.dao';
import { ChildTableTypes } from './child.types';

export class ChildService {
	private childDao: ChildDao;
	private jwtPayload: JwtPayload;

	constructor(childDao: ChildDao, jwtPayload: JwtPayload) {
		this.childDao = childDao;
		this.jwtPayload = jwtPayload;
	}

	async create(data: Omit<ChildTableTypes, 'fatherId'>) {
		await this.childDao.create({ ...data, fatherId: this.jwtPayload.userId });
	}

	async fetchById(childId: number): Promise<ChildTableTypes> {
		const child = await this.childDao.fetchById(childId);

		if (!child) {
			throw new HTTPException(404, { message: 'Child not found' });
		}

		if (child.fatherId !== this.jwtPayload.userId) {
			throw new HTTPException(401, { message: "Child doesn't below to user" });
		}

		return child;
	}
}
