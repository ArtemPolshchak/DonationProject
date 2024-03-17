import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {Server} from "../common/server";
import {DonatorBonus} from "../common/donatorBonus";

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private httpClient: HttpClient) { }

  public getAll(pageNumber?: number, pageSize?: number) {
    const url: string = `api/servers/server-names?page=${pageNumber}&pageSize=${pageSize}`
    console.log(url)
    return this.httpClient.get<GetServerResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
        map(response => response));
  }

  public create(newServer: CreateServerDto) {
    const url: string = `api/servers`
    console.log(url)
    return this.httpClient.post<void>(url, newServer,  {
      headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}
    });
  }

  public getDonatorsBonusesByServerId(serverId: number, pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/servers/${serverId}/donators-bonuses?page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    console.log(url);
    console.log("pageSize" + pageSize);
    console.log(url);
    return this.httpClient.get<GetDonatorBonuses>(url, { headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') } }).pipe(
        map(response => response));
  }
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
