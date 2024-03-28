import {Injectable} from '@angular/core';
import {User} from "../common/user";
import {HttpClientService} from "./http-client.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAll(pageNumber?: number, pageSize?: number) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize);
        const url: string = `api/users`
        return this.httpClient.fetch<GetUserResponse>(url, true, params);
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

