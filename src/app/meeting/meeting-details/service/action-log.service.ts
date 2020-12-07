import {Injectable} from '@angular/core';
import {MasterService} from '../../core/master.service';
import {ActionLog} from '../../model/action-log';
import {HttpClient} from '@angular/common/http';
import {service_name} from '../../../constant/service-name.properties';
import {event_log_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class ActionLogService extends MasterService<ActionLog> {

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_EVENT_LOG, event_log_paths.EVENT_LOG);
  }

  isValid(dto: ActionLog[]) {
  }

}
