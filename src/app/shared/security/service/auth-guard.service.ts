import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {Observable, of as observableOf, Subscription} from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import {User} from '../../model/user';
import {environment} from '../../../../environments/environment';
import {Permission} from '../../../meeting/master-settings/acl/permission/model/permission';
import {PermissionService} from '../../../meeting/master-settings/acl/permission/service/permission.service';
import {UserRolesService} from '../../../meeting/master-settings/acl/user-roles/service/user-roles.service';
import {UserRoles} from '../../../meeting/master-settings/acl/user-roles/model/user-roles';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private localStorageItem = 'token';
  private readonly user: User;
  private subscription: Observable<string[]>;

  constructor(private router: Router,
              protected userRolesService: UserRolesService,
              private authenticationService: AuthenticationService,
              protected permissionService: PermissionService) {
    this.user = new User();
  }


  static getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let paramRole = '';
    observableOf(route.queryParams).subscribe(params => {
      if (params['role']) {
        paramRole = params['role'];
      } else if (this.hasValidLogin(params) === false) {
        window.location.replace(environment.LOG_IN_API_Endpoint + '#LOG_IN_REDIRECT#' +
          window.location.href);
        return false;
      }
    });
    let allowedRoles: string[] = [];
    if (route.data.hasOwnProperty('roles')) {
      allowedRoles = route.data['roles'];
    }
    const currentUserRoles: string[] = [];
    if (paramRole) {
      currentUserRoles.push(paramRole);
    }
    if (!this.authenticationService.currentUserValue) {
      this.authenticationService.logout();
      return false;
    } else if (!this.authenticationService.currentUserValue.roles) {
      return this.subscription.toPromise().then(roles => {
        this.setCurrentUserRoles(roles);
        return this.checkAuthorization(allowedRoles, currentUserRoles);
      });
    } else {
      return this.checkAuthorization(allowedRoles, currentUserRoles);
    }
  }

  checkAuthorization(allowedRoles: string[], currentUserRoles: string[]): boolean | UrlTree {
    if ((allowedRoles.length === 0
      || currentUserRoles
        .concat(this.authenticationService.currentUserValue.roles)
        .filter(role => allowedRoles.includes(role)).length > 0) === false) {
      return this.router.createUrlTree(['/unauthorized']);
    }
    return true;
  }

  getCurrentUserRole(): Observable<string[]> {
    const userRole = new UserRoles();
    userRole.employeeOid = this.user.employeeOfficeId;
    return this.userRolesService.search(userRole)
      .pipe(
        map(res => res.data.content.map(role => role.roleTag))
      );
  }

  setCurrentUserRoles(roles: string[]) {
    this.user.roles = roles;
    this.authenticationService.cus(JSON.stringify(this.user));
  }


  hasParamToken(params): boolean {
    if (params === undefined || params === null || params[this.localStorageItem] === null || params[this.localStorageItem] === undefined) {
      return false;
    }
    // localStorage.clear();
    this.saveToken(params);
    this.clearUrl();
    this.subscription = this.getCurrentUserRole();
    this.setPermissionsAtLocalStorage();
    return true;
  }

  clearUrl() {
    this.router.navigate([], {
      queryParams: null,
      queryParamsHandling: 'merge'
    });
  }

  saveToken(params): void {
    localStorage.setItem(this.localStorageItem, params[this.localStorageItem]);
    const tokenValue = AuthGuardService.getDecodedAccessToken(params[this.localStorageItem]);
    this.user.employeeId = tokenValue.employeeId;
    this.user.username = tokenValue.user_name;
    this.user.oid = tokenValue.userOid;
    this.user.employeeOfficeId = tokenValue.employeeOfficeId;
    this.user.officeOid = tokenValue.officeId;
    this.user.access_token = params[this.localStorageItem];
    this.authenticationService.cus(JSON.stringify(this.user));
  }

  hasLocalToken() {
    const token = localStorage.getItem(this.localStorageItem);
    return token !== 'null' && token !== 'undefined' && token !== null && token !== undefined;
  }

  hasValidLogin(params) {
    if (this.hasParamToken(params)) {
      return true;
    }
    return this.hasLocalToken();
  }

  setPermissionsAtLocalStorage() {
    let permissionMap: Map<string, boolean> = new Map<string, boolean>();
    this.permissionService.getUserAllPermissions(new Permission())
      .subscribe(x => {
        permissionMap = x.data;
        localStorage.setItem('userAllPermissions', JSON.stringify({user_permissions: permissionMap}));
      }, error => {
      }, () => {
      });
  }
}
