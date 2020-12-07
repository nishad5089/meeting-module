import { Injectable } from '@angular/core';
import {MasterService} from '../../../core/master.service';
import {MeetingFrequency} from '../model/meeting-frequency';
import {HttpClient} from '@angular/common/http';
import {service_name} from '../../../../constant/service-name.properties';
import {master_settings_paths} from '../../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class MeetingFrequencyService extends MasterService<MeetingFrequency> {

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, master_settings_paths.FREQUENCIES);
  }

  isValid(dto: MeetingFrequency[]) {
  }
}
