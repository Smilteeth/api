type SqliteError = Record<string, { message: string; code: 409 | 400 }>;
export const d1Errors: SqliteError = {
	UNIQUE: {
		message: 'The information you provided is already registered. Please use unique details.',
		code: 409
	},
	'FOREIGN KEY': {
		message:
			'Cannot complete your request due to a relationship with other data. Please ensure all related information exists first.',
		code: 400
	},

	'NOT NULL': {
		message: 'A required field is missing. Please provide all necessary information.',
		code: 400
	},
	CHECK: {
		message: 'The value provided for one or more fields is invalid. Please check your input.',
		code: 400
	},

	'PRIMARY KEY': {
		message: 'A record with this identifier already exists. Please use a different identifier.',
		code: 409
	}
};
