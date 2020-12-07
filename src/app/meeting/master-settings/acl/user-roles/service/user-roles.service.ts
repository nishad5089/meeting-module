import {Injectable} from '@angular/core';
import {MasterService} from '../../../../core/master.service';
import {UserRoles} from '../model/user-roles';
import {HttpClient} from '@angular/common/http';
import {Permission} from '../../permission/model/permission';
import {AuthenticationService} from '../../../../../shared/security/service/authentication.service';
import {PermissionService} from '../../permission/service/permission.service';
import {service_name} from '../../../../../constant/service-name.properties';


@Injectable({
  providedIn: 'root'
})


export class UserRolesService extends MasterService<UserRoles> {

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, UserRolesService.REQUEST_PATH);
  }


  public static PATH = '/acl/user-roles';
  public static REQUEST_PATH = '/user-roles';

  permission: Permission;


  isValid(dto: UserRoles[]): boolean {
    return false;
  }
}
