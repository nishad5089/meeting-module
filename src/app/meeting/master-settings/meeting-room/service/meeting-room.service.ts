import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeetingRoom} from '../../../../../app/meeting/master-settings/meeting-room/model/meeting-room';
import {MasterService} from '../../../../../app/meeting/core/master.service';
import {service_name} from '../../../../constant/service-name.properties';
import {master_settings_paths} from '../../../../constant/service-path.properties';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MeetingRoomService extends MasterService<MeetingRoom> {

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, master_settings_paths.ROOMS);
  }

  isValid(dto: MeetingRoom[]) {
  }

  getOptionLabel(dto: MeetingRoom): string {
    return dto.roomName;
  }

}
