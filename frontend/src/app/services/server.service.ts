import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {Server} from "../common/server";
import {DonatorBonus} from "../common/donatorBonus";
import {CreateDonatorBonus} from "../common/create-donator-bonus";

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private httpClient: HttpClient) { }

  public getAllServerNames(pageNumber?: number, pageSize?: number) {
    const url: string = `api/servers/names?page=${pageNumber}&pageSize=${pageSize}`
    return this.httpClient.get<GetServerResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
        map(response => response));
  }

  public create(newServer: CreateServerDto) {
    const url: string = `api/servers`
    return this.httpClient.post<void>(url, newServer,  {
      headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}
    });
  }

  public getDonatorsBonusesByServerId(serverId: number, pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/servers/${serverId}/donator-bonus?page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<GetDonatorBonuses>(url, { headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') } }).pipe(
        map(response => response));
  }

  public searchDonatorsByEmailContains(serverId: number, email?: string, pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/servers/${serverId}/donator-search?email=${email}&page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<GetDonatorBonuses>(url, { headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') } });
  }

  public updateDonatorsBonusOnServer(dto: UpdateDonatorsBonus) {
    const url: string = `api/servers/update-donator-bonus`;
    return this.httpClient.put<UpdateDonatorsBonus>(url, dto, { headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') } });
  }

  public createDonatorsBonusOnServer(dto: CreateDonatorBonus) {
    const url: string = `api/servers/create-donator-bonus`;
    return this.httpClient.post<CreateDonatorBonus>(url, dto, { headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') } });
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
