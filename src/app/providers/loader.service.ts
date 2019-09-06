import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loaderSubject$ = new Subject<boolean>();

  loader$ = this.loaderSubject$.asObservable();

  showLoader() {
    this.loaderSubject$.next(true);
  }

  hideLoader() {
    this.loaderSubject$.next(false);
  }

  constructor() { }
}
