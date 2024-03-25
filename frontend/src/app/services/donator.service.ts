import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Donator} from "../common/donator";
import {CreateServerDto} from "./server.service";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class DonatorService {

  constructor(private httpClient: HttpClient) {
  }

  public getAll(pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/donators/?page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    console.log(url)
    return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + StorageService.getToken()}}).pipe(
        map(response => response));
  }

  public search(donatorMails?: string, pageNumber?: number, pageSize?: number, sort?: string) {
    const url: string = `api/donators/search?mail=${donatorMails}&page=${pageNumber}&size=${pageSize}&sort=${sort}`;
    console.log(url)
    return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + StorageService.getToken()}}).pipe(
        map(response => response));
  }

  public createDonator(email: CreateDonator)  {
    const url: string = `api/donators`
    return this.httpClient.post<void>(url, email, { headers: {'Authorization': 'Bearer ' + StorageService.getToken()} });
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

export interface CreateDonator {
  email: string;
}

