import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class ServerBonusService {

  constructor(private httpClient: HttpClient) { }

  public createOrRecreateBonuses(serverBonuses: ServerBonusDto[], serverId?: number) {
    const url: string = `api/server-bonus-settings?serverId=${serverId}`;
    console.log(url);
    console.log(serverId + "server ID")
    return this.httpClient.post<void>(url, serverBonuses, {
      headers: {'Authorization': 'Bearer ' + StorageService.getToken()}
    });
  }


}

export interface ServerBonusDto {
  fromAmount: number;
  toAmount: number;
  bonusPercentage: number;
}