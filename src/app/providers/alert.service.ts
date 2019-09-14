import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert, AlertType } from '../classes/alert.class';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertSubject$ = new Subject<{ show: boolean, alert: Alert }>();

  alert$ = this.alertSubject$.asObservable();

  showError(message: string, persist: boolean = false) {
    this.showAlert(new Alert({ message: message, type: AlertType.error, persist: persist }));
  }

  showInfo(message: string, persist: boolean = false) {
    this.showAlert(new Alert({ message: message, type: AlertType.info, persist: persist }));
  }

  showSuccess(message: string, persist: boolean = false) {
    this.showAlert(new Alert({ message: message, type: AlertType.success, persist: persist }));
  }

  showAlert(alert: Alert) {
    console.log(alert);
    this.alertSubject$.next({
      show: true,
      alert: alert
    });
  }

  /**
   * Hides the last alert
   */
  hideAlert() {
    this.alertSubject$.next({
      show: false,
      alert: null
    });
  }

  constructor() { }
}
