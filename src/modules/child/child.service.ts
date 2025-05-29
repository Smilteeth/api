import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { ChildDao } from './child.dao';
import { ChildTableTypes } from './child.types';
import { Pagination, PaginationType } from '../../utils/pagination';

export class ChildService {
	private childDao: ChildDao;
	private jwtPayload: JwtPayload;
	private pagination: Pagination;

	constructor(childDao: ChildDao, jwtPayload: JwtPayload) {
		this.childDao = childDao;
		this.jwtPayload = jwtPayload;
		this.pagination = new Pagination();
	}

	async create(data: Omit<ChildTableTypes, 'fatherId'>) {
		await this.childDao.create({ ...data, fatherId: this.jwtPayload.userId });
	}

	async fetchUserChilds(
		page: number,
		limit: number
	): Promise<PaginationType<Omit<ChildTableTypes, 'lastModificationDate'>>> {
		const childs = await this.childDao.fetchUserChilds(this.jwtPayload.userId);

		if (!childs) {
			throw new HTTPException(404, { message: 'Childs not found' });
		}

		return this.pagination.generate<Omit<ChildTableTypes, 'lastModificationDate'>>(childs, page, limit);
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
