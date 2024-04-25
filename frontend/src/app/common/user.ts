import {Role} from "../enums/role";

export class User {
    id!: number;
    username!: string;
    email!: string;
    role!: Role;
    isTfaActive!: boolean;
    password?: string;
    repeatedPassword?: string;
}
