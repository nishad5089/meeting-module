import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private subject = new Subject<any>();

  constructor() {
  }

  getBreadcrumb() {
    return this.subject.asObservable();
  }

  setBreadcrumb(breadcrumb: any) {
    this.subject.next(breadcrumb);
  }

}
