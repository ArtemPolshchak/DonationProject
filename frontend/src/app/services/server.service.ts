import {Injectable} from '@angular/core';
import {Server} from "../common/server";
import {DonatorBonus} from "../common/donatorBonus";
import {CreateDonatorBonus} from "../common/create-donator-bonus";
import {HttpClientService} from "./http-client.service";
import {GET, POST, PUT} from "../enums/app-constans";
import {LoadDonatorBonus} from "../common/load-donator-bonus";

@Injectable({
    providedIn: 'root'
})
export class ServerService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllServerNames(pageNumber?: number, pageSize?: number, sortState?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sortState);
        const url: string = `api/servers/names`
        return this.httpClient.fetch<GetServerResponse>(GET, url, true, params)
    }

    public create(newServer: CreateServerDto) {
        const url: string = `api/servers`
        return this.httpClient.load<void>(POST, url, true, newServer);
    }

    public getDonatorsBonusesByServerId(serverId: number, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort);
        const url: string = `api/servers/${serverId}/donators/bonus`;
        return this.httpClient.fetch<GetDonatorBonuses>(GET, url, true, params);
    }

    public searchDonatorsByEmailContains(serverId: number, email?: string, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort, email);
        const url: string = `api/servers/${serverId}/donator-search`;
        return this.httpClient.fetch<GetDonatorBonuses>(GET, url, true, params);
    }

    public updateDonatorsBonusOnServer(serverId: number, donatorId: number, dto: LoadDonatorBonus) {
        const url: string = `api/servers/${serverId}/donators/${donatorId}/bonus`;
        return this.httpClient.load<DonatorsBonusResponse>(PUT, url, true, dto);
    }

    public createDonatorsBonusOnServer(serverId: number, donatorId: number, dto: LoadDonatorBonus) {
        const url: string = `api/servers/${serverId}/donators/${donatorId}/bonus`;
        return this.httpClient.load<CreateDonatorBonus>(POST, url, true, dto);
    }
}

export interface DonatorsBonusResponse {
    id: number;
    email: string;
    personalBonus: number;
}

interface GetServerResponse {
    content: Server[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

interface GetDonatorBonuses {
    content: DonatorBonus[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

export interface CreateServerDto {
    serverName: string;
    serverUrl: string;
    serverUserName: string;
    serverPassword: string;
}
