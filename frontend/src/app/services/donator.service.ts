import {Injectable} from '@angular/core';
import {Donator} from "../common/donator";
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DonatorService {

    constructor(private httpClient: HttpClientService) {
    }

    public search(pageNumber?: number, pageSize?: number, sort?: string, donatorsMail?: string, serverNames?: string[]) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort, donatorsMail, serverNames);
        const url: string = `api/donators/donations`;
        return this.httpClient.fetch<GetDonatorTotalDonationsResponse>(url, true, params);
    }

    public createDonator(email: CreateDonator) {
        const url: string = `api/donators`
        return this.httpClient.load<Donator>(HttpMethod.POST, url, true, email);
    }
}

interface GetDonatorTotalDonationsResponse {
    content: {
        donator: Donator;
        totalDonations: number;
        totalCompletedTransactions: number;
    }[];
    pageable: {
        pageNumber: number;
        pageSize: number
    };
    totalElements: number;
}

export interface CreateDonator {
    email: string;
}

