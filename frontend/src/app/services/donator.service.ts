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

  public getAll(pageNumber?: number, pageSize?: number) {
    const url: string = `api/donators/?page=${pageNumber}&pageSize=${pageSize}`
    console.log(url)
    return this.httpClient.get<GetTransactionResponse>(url).pipe(
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
