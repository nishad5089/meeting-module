import {MasterService} from '../../../../core/master.service';
import {Permission} from '../model/permission';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../../../../../shared/security/service/authentication.service';
import {roles} from '../../../../../constant/roles.constant';
import {service_name} from '../../../../../constant/service-name.properties';
import {ResponseDataModel} from "../../../../core/response-data.model";

@Injectable({
  providedIn: 'root'
})

export class PermissionService extends MasterService<Permission> {

  public static PATH = '/acl/permissions';
  public static REQUEST_PATH = '/meetings/permissions';

  constructor(public http: HttpClient,
                        public authenticationService: AuthenticationService) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, PermissionService.REQUEST_PATH);
  }

  isValid(dto: Permission[]): boolean {
    return false;
  }

  public hasPermission(dto: Permission): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + 'has-permission',
      dto);
  }

  public getPermissions(dto: Permission): Observable<ResponseDataModel<Map<string, boolean>>> {
    return this.http.post<ResponseDataModel<Map<string, boolean>>>(
      this.getUrl() + 'get-permissions',
      dto);
  }


  public getUserPermissions(): void {
    // const currentUser = this.authenticationService.currentUserValue;
    this.getPermissions(new Permission({roleTag: roles.MEM_MEETING_ADMIN})).subscribe(x => {
    });
  }

  public getMeetingPermissions(ownershipStatus: string): Observable<any> {
    return this.getPermissions(new Permission({roleTag: ownershipStatus}));
  }

  public getUserAllPermissions(dto: Permission): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + 'get-current-user-permissions',
      dto);
  }


}
