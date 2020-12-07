import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertService} from '../service/alert-service.service';
import {ErrorModel} from '../model/error.model';
import {error} from 'selenium-webdriver';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;
  errors: ErrorModel;
  errorsList = [];

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getAlert().subscribe(message => {
      switch (message && message.type) {
        case 'success':
          message.cssClass = 'alert alert-success';
          break;
        case 'error':
          this.errors = message.text;
          message.cssClass = 'alert alert-danger';
          break;
      }
      this.message = message;
      if (this.errors) {
        if (this.errors.generalErrors) {
          this.errorsList = this.errorsList.concat(this.errors.generalErrors);
        }
        if (this.errors.fieldErrors) {
          this.errors.fieldErrors.forEach((val, key) => {
            const err = key + ': ' + val;
            this.errorsList.push(err);
          });
        }
        if (!this.errors.generalErrors && !this.errors.fieldErrors && this.errors.message) {
          this.errorsList.push(this.errors.message);
        }
        this.errorsList = Array.from(new Set(this.errorsList));
      }
    });


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clear() {
    this.errors = undefined;
    this.errorsList = [];
    this.alertService.clear();
  }

  setRight(): string {
    return environment.IS_MODAL_OPEN ? '0px' : '30px';
  }

  setLeft() {
    return environment.IS_MODAL_OPEN ? '0px' : '30px';
  }

  setBottom() {
    return environment.IS_MODAL_OPEN ? '0px' : '1rem';
  }
}
