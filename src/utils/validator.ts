import bcrypt from "bcryptjs";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export class Validator {
    async password(givenPassword: string, userPassword: string): Promise<boolean>{
        try {
            return await bcrypt.compare(givenPassword, userPassword);
        } catch (error) {
            throw new Error(`Error comparing passwords: ${(error as Error).message}`);
        }

    }

    authHeaders(c: Context) {
        const authHeader = c.req.header('Authorization');

        if (!authHeader) {
            throw new HTTPException(401, {
                message: "Missing authorization header" 
            });
        }

        const splitedHeader = authHeader.split(' ');

        if(splitedHeader[0] !== 'Bearer')  {

            throw new HTTPException(401, {
                message: "Authorization needs to be a Bearer token" 
            });
        }

        const token = splitedHeader[1];

        if (!token) {
            throw new HTTPException(401, {
                message: 'Bearer token is missing' 
            });
        }
    }

}
