import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MasterService} from '../../core/master.service';
import {MeetingInviteesHonorarium} from '../../model/meeting-invitees-honorarium';
import {service_name} from '../../../constant/service-name.properties';
import {account_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService extends MasterService<MeetingInviteesHonorarium> {
  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_ACCOUNTS, account_paths.ATTENDANCE);
  }

  isValid(dto: MeetingInviteesHonorarium[]) {
  }


}
