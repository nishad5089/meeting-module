import {MasterService} from '../../../../core/master.service';
import {Roles} from '../model/roles';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {service_name} from '../../../../../constant/service-name.properties';


@Injectable({
  providedIn: 'root'
})

export class RolesService extends MasterService<Roles> {

  public static PATH = '/acl/roles';
  public static REQUEST_PATH = '/meetings/roles';

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, RolesService.REQUEST_PATH);
  }

  isValid(dto: Roles[]): boolean {
    return false;
  }

  // getUrl(): string {
  //   return 'http://localhost' + this.serviceName + this.path + '/';
  // }

}
