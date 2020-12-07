import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../model/user';
import {HttpClient} from '@angular/common/http';
import {environment, IS_LIVE} from '../../../../environments/environment';
import {service_name} from '../../../constant/service-name.properties';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private localStorageItem = 'currentUser';

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(public http: HttpClient) {
    this.cus(localStorage.getItem(this.localStorageItem));
  }

  public cus(user) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user));
    this.currentUser = this.currentUserSubject.asObservable();
    localStorage.setItem('currentUser', user);
    this.currentUserSubject.next(JSON.parse(user));
  }

  public us(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // getUrl(): string {
  //   let url = environment.GLOBAL_GATEWAY_URL;
  //   if (IS_LIVE) {
  //     url += '/' + service_name.CMN_AUTH_SERVICE;
  //   }
  //   return url + '/' + service_name.CMN_AUTH_SERVICE + '/';
  // }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    // window.location.replace(environment.LOG_IN_API_Endpoint + '#LOG_OUT_END_POINT#');
  }

}
