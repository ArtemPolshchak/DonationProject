import {Injectable} from '@angular/core';
import {Server} from "../common/server";
import {DonatorBonus} from "../common/donatorBonus";
import {CreateDonatorBonus} from "../common/create-donator-bonus";
import {HttpClientService} from "./http-client.service";
import {LoadDonatorBonus} from "../common/load-donator-bonus";
import {HttpMethod} from "../enums/http-method";

@Injectable({
    providedIn: 'root'
})
export class ServerService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllServerNames(pageNumber?: number, pageSize?: number, sortState?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sortState);
        const url: string = `api/servers/names`
        return this.httpClient.fetch<GetServerResponse>(url, true, params)
    }

    public create(newServer: ServerDto) {
        const url: string = `api/servers`
        return this.httpClient.load<void>(HttpMethod.POST, url, true, newServer);
    }

    public getDonatorsBonusesByServerId(serverId: number, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort);
        const url: string = `api/servers/${serverId}/donators/bonus`;
        return this.httpClient.fetch<GetDonatorBonuses>(url, true, params);
    }

    public searchDonatorsByEmailContains(serverId: number, email?: string, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort, email);
        const url: string = `api/servers/${serverId}/donators/search`;
        return this.httpClient.fetch<GetDonatorBonuses>(url, true, params);
    }

    public updateDonatorsBonusOnServer(serverId: number, donatorId: number, dto: LoadDonatorBonus) {
        const url: string = `api/servers/${serverId}/donators/${donatorId}/bonus`;
        return this.httpClient.load<DonatorsBonusResponse>(HttpMethod.PUT, url, true, dto);
    }

    public createDonatorsBonusOnServer(serverId: number, donatorId: number, dto: LoadDonatorBonus) {
        const url: string = `api/servers/${serverId}/donators/${donatorId}/bonus`;
        return this.httpClient.load<CreateDonatorBonus>(HttpMethod.POST, url, true, dto);
    }

    public updateServerById(serverId: number, dto: ServerDto) {
        const url: string = `api/servers/${serverId}`;
        return this.httpClient.load<ServerDto>(HttpMethod.PATCH, url, true, dto);
    }

    public getServerById(ServerId: number) {
        const url: string = `api/servers/${ServerId}`;
        return this.httpClient.fetch<ServerDto>(url, true);
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

export interface ServerDto {
    serverName: string;
    serverUrl: string;
    serverUserName: string;
    serverPassword: string;
}
