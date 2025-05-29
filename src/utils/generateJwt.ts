import { config } from 'dotenv';
import { sign } from 'hono/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';

config({ path: 'env' });

export class JwtUtil {
	private secret: SignatureKey;

	constructor(secret: SignatureKey) {
		this.secret = secret;
	}

	async generateJwt(userId: number, type: string) {
		const payload = {
			userId: userId,
			type: type,
			exp: Math.floor(Date.now() / 1000) + 1209600 // Token expires in 2 weeks
		};

		const token = await sign(payload, this.secret);

		return { token: token, exp: payload.exp };
	}
}
