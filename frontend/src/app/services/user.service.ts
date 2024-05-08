import {Injectable} from '@angular/core';
import {User} from "../common/user";
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAll(pageNumber?: number, pageSize?: number) {
        const url: string = `api/users`
        const params = this.httpClient.getHttpParams({page: pageNumber, size: pageSize});
        return this.httpClient.fetch<GetUsersResponse>(url, true, params);
    }

    public create(user: User) {
        const url: string = `api/users/sign-up`
        return this.httpClient.load<User>(HttpMethod.POST, url, true, user);
    }

    public update(user: User) {
        const url: string = `api/users/${user.id}`
        return this.httpClient.load<User>(HttpMethod.PATCH, url, true, user);
    }

     public tfaReset(id: number) {
         const url: string = `api/users/${id}/tfa`
         return this.httpClient.load<User>(HttpMethod.PATCH, url, true);
    }
}

interface GetUsersResponse {
    content: User[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

