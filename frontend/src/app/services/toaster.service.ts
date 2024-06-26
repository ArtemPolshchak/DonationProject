import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  durationInSeconds: number = 5;
  constructor(
      private _snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Закрыть', {
      duration: this.durationInSeconds * 1000,
      verticalPosition: "top"
    });
  }
}
