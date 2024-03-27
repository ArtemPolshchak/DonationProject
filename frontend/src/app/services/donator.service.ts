import {Injectable} from '@angular/core';
import {Donator} from "../common/donator";
import {HttpClientService} from "./http-client.service";
import {GET} from "../enums/app-constans";

@Injectable({
    providedIn: 'root'
})
export class DonatorService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAll(pageNumber?: number, pageSize?: number, sort?: string) {
        const url: string = `api/donators/?page=${pageNumber}&size=${pageSize}&sort=${sort}`;
        return this.httpClient.process<GetTransactionResponse>(GET, url, true);
    }

    public search(donatorMails?: string, pageNumber?: number, pageSize?: number, sort?: string) {
        const url: string = `api/donators/search?mail=${donatorMails}&page=${pageNumber}&size=${pageSize}&sort=${sort}`;
        return this.httpClient.process<GetTransactionResponse>(GET, url, true);
    }

    public createDonator(email: CreateDonator) {
        const url: string = `api/donators`
        return this.httpClient.process<GetTransactionResponse>(GET, url, true, email);
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

