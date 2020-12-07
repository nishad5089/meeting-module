import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MasterService} from '../../core/master.service';
import {MeetingRole} from '../../model/meeting-role';
import {service_name} from '../../../constant/service-name.properties';
import {master_settings_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class MeetingRoleService extends MasterService<MeetingRole> {

  constructor(public http: HttpClient) {
    // super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, '/meetings/roles');
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, master_settings_paths.ROLES);
    // this.serviceName = 'mem-service-master-settings';
  }

  isValid(dto: []) {
  }

}
