import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (error) {
		throw new Error(`Error hashing password: ${(error as Error).message}`);
	}
}
