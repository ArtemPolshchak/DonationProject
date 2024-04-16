import {Injectable} from '@angular/core';
import {Donator} from "../common/donator";
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";

@Injectable({
    providedIn: 'root'
})
export class DonatorService {

    constructor(private httpClient: HttpClientService) {
    }

    public search(pageNumber?: number, pageSize?: number, sort?: string, donatorsMail?: string, serverId?: number | string) {
        const url: string = `api/donators/donations`;
        const params = this.httpClient.getHttpParams(
            {
                page: pageNumber,
                size: pageSize,
                sort: sort,
                donatorsMail: donatorsMail,
                serverId: serverId,
            }
        );
        return this.httpClient.fetch<GetDonatorTotalDonationsResponse>(url, true, params);
    }

    public createDonator(email: CreateDonator) {
        const url: string = `api/donators`
        return this.httpClient.load<Donator>(HttpMethod.POST, url, true, email);
    }
}

interface GetDonatorTotalDonationsResponse {
    content: Donator[];
    pageable: {
        pageNumber: number;
        pageSize: number
    };
    totalElements: number;
}

export interface CreateDonator {
    email: string;
}

