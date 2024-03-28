import {Injectable} from '@angular/core';
import {Donator} from "../common/donator";
import {HttpClientService} from "./http-client.service";
import {GET, POST} from "../enums/app-constans";

@Injectable({
    providedIn: 'root'
})
export class DonatorService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAll(pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort);
        const url: string = `api/donators`;
        return this.httpClient.fetch<GetTransactionResponse>(GET, url, true, params);
    }

    public search(donatorMails?: string, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort, donatorMails);
        const url: string = `api/donators/search`;
        return this.httpClient.fetch<GetTransactionResponse>(GET, url, true, params);
    }

    public createDonator(email: CreateDonator) {
        const url: string = `api/donators`
        return this.httpClient.load<GetTransactionResponse>(POST, url, true, email);
    }
}

interface GetTransactionResponse {
    content: Donator[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

export interface CreateDonator {
    email: string;
}

