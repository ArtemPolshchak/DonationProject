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
    return this.httpClient.get<GetServerResponse>(url).pipe(
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
