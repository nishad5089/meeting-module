import {MasterService} from '../../../../core/master.service';
import {MeetingStatus} from '../model/meeting-status';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {service_name} from "../../../../../constant/service-name.properties";

@Injectable({
  providedIn: 'root'
})

export class MeetingStatusService extends MasterService<MeetingStatus> {

  public static PATH = '/acl/status';
  public static REQUEST_PATH = '/meetings/statuses';

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, MeetingStatusService.REQUEST_PATH);
  }

  isValid(dto: MeetingStatus[]): boolean {
    return false;
  }

}
