import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthenticationService} from '../security/service/authentication.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    if (localStorage.getItem('currentUser') && currentUser && currentUser.access_token) {
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': `*`,
          'Authorization': `Bearer ${currentUser.access_token}`,
          'employeeId': currentUser.employeeId ? currentUser.employeeId : '',
          // 'employeeId': 'f12be363-75f8-4856-9d3e-ea173a38d57e'
        }
      });
    } else {
      this.authenticationService.logout();
    }
    return next.handle(request);
  }

}
