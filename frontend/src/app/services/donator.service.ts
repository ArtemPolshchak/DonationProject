import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {Donator} from "../common/donator";

@Injectable({
  providedIn: 'root'
})
export class DonatorService {

  constructor(private httpClient: HttpClient) {
  }

  public getAll(pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/donators/?page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    console.log(url)
    return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
        map(response => response));
  }

  public search(donatorMails?: string, pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/donators/search?mail=${donatorMails}&page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    console.log(url)
    return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
        map(response => response));
  }
}

interface GetTransactionResponse {
  content: Donator[];
  pageable: {
    pageNumber: number;
    pageSize: number
  }
  totalElements: number;
}
