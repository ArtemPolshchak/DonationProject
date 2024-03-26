import {Injectable} from '@angular/core';
import {map} from "rxjs";
import {Server} from "../common/server";
import {DonatorBonus} from "../common/donatorBonus";
import {CreateDonatorBonus} from "../common/create-donator-bonus";
import {HttpClientService} from "./http-client.service";
import {GET, POST, PUT} from "../enums/app-constans";
import {StorageService} from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class ServerService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllServerNames(pageNumber?: number, pageSize?: number) {
        const url: string = `api/servers/names?page=${pageNumber}&pageSize=${pageSize}`
        return this.httpClient.process<GetServerResponse>(GET, url, true)
    }

    public create(newServer: CreateServerDto) {
        const url: string = `api/servers`
        return this.httpClient.process<void>(POST, url, true, newServer);
    }

    public getDonatorsBonusesByServerId(serverId: number, pageNumber?: number, pageSize?: number, sort?: string) {
        const url: string = `api/servers/${serverId}/donator-bonus?page=${pageNumber}&size=${pageSize}&sort=${sort}`;
        return this.httpClient.process<GetDonatorBonuses>(GET, url, true);
    }

    public searchDonatorsByEmailContains(serverId: number, email?: string, pageNumber?: number, pageSize?: number, sort?: string) {
        const url: string = `api/servers/${serverId}/donator-search?email=${email}&page=${pageNumber}&size=${pageSize}&sort=${sort}`;
        return this.httpClient.process<GetDonatorBonuses>(GET, url, true);
    }

    public updateDonatorsBonusOnServer(dto: UpdateDonatorsBonus) {
        const url: string = `api/servers/update-donator-bonus`;
        return this.httpClient.process<UpdateDonatorsBonus>(PUT, url, true, dto);
    }

    public createDonatorsBonusOnServer(dto: CreateDonatorBonus) {
        const url: string = `api/servers/create-donator-bonus`;
        return this.httpClient.process<CreateDonatorBonus>(POST, url, true, dto);
    }
}

export interface UpdateDonatorsBonus {
    serverId: number;
    donatorId: number;
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
