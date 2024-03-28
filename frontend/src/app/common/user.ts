import {Role} from "../enums/role";

export class User {
    id!: number;
    username!: string;
    email!: string;
    role!: Role;

    constructor(id: number, username: string, email: string, role: Role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
