import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";
import {ServerBonuses} from "../common/server-bonuses";


@Injectable({
    providedIn: 'root'
})
export class ServerBonusService {

    constructor(private httpClient: HttpClientService) {
    }

    public createOrRecreateBonuses(serverBonuses: ServerBonusDto[], serverId?: number) {
        const url: string = `api/server-bonus-settings?serverId=${serverId}`;
        return this.httpClient.load<void>(HttpMethod.POST, url, true, serverBonuses);
    }

    public getServerBonusesFromServerById(serverId: number) {
        const url: string = `api/server-bonus-settings/${serverId}`;
        return this.httpClient.fetch<ServerBonuses[]>(url, true)
    }
}

export interface ServerBonusDto {
    fromAmount: number;
    toAmount: number;
    bonusPercentage: number;
}
