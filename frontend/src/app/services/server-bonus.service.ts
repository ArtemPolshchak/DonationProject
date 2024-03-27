import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {POST} from "../enums/app-constans";

@Injectable({
    providedIn: 'root'
})
export class ServerBonusService {

    constructor(private httpClient: HttpClientService) {
    }

    public createOrRecreateBonuses(serverBonuses: ServerBonusDto[], serverId?: number) {
        const url: string = `api/server-bonus-settings?serverId=${serverId}`;
        return this.httpClient.load<void>(POST, url, true, serverBonuses);
    }
}

export interface ServerBonusDto {
    fromAmount: number;
    toAmount: number;
    bonusPercentage: number;
}