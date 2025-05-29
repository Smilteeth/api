export type PaginationType<T> = {
	page: number;
	limit: number;
	totalPages: number;
	items: Array<T>;
};

export class Pagination {
	generate<T>(data: Array<T>, page: number = 1, limit: number = 10): PaginationType<T> {
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		return {
			page: page,
			limit: limit,
			totalPages: Math.ceil(data.length / limit),
			items: data.slice(startIndex, endIndex)
		};
	}

	getPaginationValues(page: string, limit: string) {
		const parsedPage = parseInt(page);
		const parsedLimit = parseInt(limit);

		return {
			parsedPage: isNaN(parsedPage) ? 1 : parsedPage,
			parsedLimit: isNaN(parsedLimit) ? 10 : parsedLimit
		};
	}
}
