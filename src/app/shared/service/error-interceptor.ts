import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../security/service/authentication.service';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {AlertService} from './alert-service.service';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private alertService: AlertService) {
  }

  parseErrorBlob(err: HttpErrorResponse): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: Event) => {
        try {
          const errmsg = JSON.parse((<any>e.target).result);
          resolve(new HttpErrorResponse({
            error: errmsg,
            headers: err.headers,
            status: err.status,
            statusText: err.statusText,
            url: err.url
          }));
        } catch (e) {
          reject(err);
        }
      };
      reader.onerror = (e) => {
        reject(err);
      };
      reader.readAsText(err.error);
    });
  }

  handleError(err) {
    if (err.error.status === 401) {
      this.authenticationService.logout();
    } else if (err.error.status === 403) {
      this.router.navigate(['/unauthorized']);
    } else if (err.error.status >= 300) {
      this.alertService.error(err.error, false);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 0) {
        this.alertService.error(
          {
            generalErrors: [
              'আপনার অনুরোধটি সম্পন্ন করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ ঠিক আছে কিনা ' +
              'যাচাই করে আবারও চেষ্টা করুন​। এরপরও কাজ না হলে এডমিনের সাথে যোগাযোগ করুন​।'
            ],
            fieldErrors: new Map<string, string>(),
            message: ''
          },
          false
        );
      }
      if (err.error instanceof Blob && err.error.type === 'application/json') {
        this.parseErrorBlob(err).then(x => {
          this.handleError(x);
        });
      } else {
        this.handleError(err);
      }
      return of(err);
    }));
  }
}
