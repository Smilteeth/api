import db from "../../db";
import { dbTypes } from "../../db/types";
import { DataAccessObject } from "../../types/dao.interface";

type UserTableType = dbTypes["UserTable"];

class AuthDao implements DataAccessObject<dbTypes["UserTable"]> {
    create(data: UserTableType): void {

    }


    getById(id: number): UserTableType {
        const user: dbTypes["UserTable"] = {};



        return user;
    }



}
