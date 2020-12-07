import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MasterService} from '../../core/master.service';
import {ExternalMeeting} from '../model/external-meeting';
import {service_name} from '../../../constant/service-name.properties';
import {meeting_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class ExternalMeetingService extends MasterService<ExternalMeeting> {

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MEETINGS, meeting_paths.EXTERNAL_MEETING);
  }

  isValid(dto: ExternalMeeting[]): boolean {
    return false;
  }

}
