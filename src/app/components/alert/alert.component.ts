import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../providers/alert.service';
import { Alert, AlertType } from '../../classes/alert.class';

const TIMEOUT = 4000;

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  alerts: Alert[] = [];

  constructor(
    private _alert: AlertService
  ) {

    this._alert.alert$.subscribe((a) => {
      if (a.show) {
        this._handleAlertShow(a.alert);
      }

      else {
        this._handleAlertHide(a.alert);
      }

    })
  }

  _handleAlertHide(alert = null) {
    if (alert) {
      this.alerts = this.alerts.filter((a) => {
        return a !== alert;
      })
    } else {
      this.alerts.pop();
    }
  }

  _handleAlertShow(alert: Alert) {
    this.alerts.push(alert);

    if (!alert.persist) {
      let t = setTimeout(() => {
        this.alerts = this.alerts.filter((a) => {
          return a !== alert;
        })

        clearTimeout(t);
      }, TIMEOUT);
    }
  }

  ngOnInit() {
  }

}
