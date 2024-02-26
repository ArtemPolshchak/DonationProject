import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {Server} from "../common/server";

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
}

interface GetServerResponse {
  content: Server[];
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
