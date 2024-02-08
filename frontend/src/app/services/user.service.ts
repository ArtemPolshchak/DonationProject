import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../common/user";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public getAll(pageNumber?: number, pageSize?: number) {
    const url: string = `api/users/?page=${pageNumber}&pageSize=${pageSize}`
    console.log(url)
    return this.httpClient.get<GetUserResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
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

