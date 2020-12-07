import {Injectable} from '@angular/core';
import {MasterService} from '../core/master.service';
import {MeetingSchedule} from '../model/meeting-schedule';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseDataModel} from '../core/response-data.model';
import {Meeting} from '../model/meeting';
import {service_name} from '../../constant/service-name.properties';
import {schedule_paths} from '../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class ScheduleService extends MasterService<MeetingSchedule> {

  END_POINT_MEETINGS = 'meetings';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_SCHEDULE, schedule_paths.SCHEDULES);
    // super(http, ':8507', '/schedules');
  }

  getMeetings(dto: MeetingSchedule): Observable<ResponseDataModel<Meeting[]>> {
    return this.http.post<ResponseDataModel<Meeting[]>>(this.getUrl() + this.END_POINT_MEETINGS, dto);
  }

  isValid(dto: MeetingSchedule[]) {
  }

}
