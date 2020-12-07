import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeetingType} from '../../../master-settings/meeting-type/model/meeting-type';
import {MasterService} from '../../../core/master.service';
import {service_name} from '../../../../constant/service-name.properties';
import {master_settings_paths} from '../../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class MeetingTypeService extends MasterService<MeetingType> {

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, master_settings_paths.TYPES);
  }

  isValid(dto: MeetingType[]) {
  }

}
