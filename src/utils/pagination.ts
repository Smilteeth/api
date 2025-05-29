export type PaginationType<T> = {
	page: number;
	limit: number;
	totalPages: number;
	items: Array<T>;
};

export function pagination<T>(data: Array<T>, page: number = 1, limit: number = 10): PaginationType<T> {
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;

	return {
		page: page,
		limit: limit,
		totalPages: Math.ceil(data.length / limit),
		items: data.slice(startIndex, endIndex)
	};
}
