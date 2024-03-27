import {Injectable} from '@angular/core';
import {User} from "../common/user";
import {GET} from "../enums/app-constans";
import {HttpClientService} from "./http-client.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAll(pageNumber?: number, pageSize?: number) {
        const url: string = `api/users/?page=${pageNumber}&pageSize=${pageSize}`
        return this.httpClient.process<GetUserResponse>(GET, url, true);
    }
}

interface GetUserResponse {
    content: User[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

