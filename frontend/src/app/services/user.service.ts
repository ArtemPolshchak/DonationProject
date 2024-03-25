import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../common/user";
import {map} from "rxjs";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public getAll(pageNumber?: number, pageSize?: number) {
    const url: string = `api/users/?page=${pageNumber}&pageSize=${pageSize}`
    console.log(url)
    return this.httpClient.get<GetUserResponse>(url, {headers: {'Authorization': 'Bearer ' + StorageService.getToken()}}).pipe(
        map(response => response));
  }

}

interface GetUserResponse {
  content: User[];
  pageable: {
    pageNumber: number;
    pageSize: number
  }
  totalElements: number;
}

