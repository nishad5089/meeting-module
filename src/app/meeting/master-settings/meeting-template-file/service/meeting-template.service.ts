import {Injectable} from '@angular/core';
import {MasterService} from '../../../core/master.service';
import {MeetingTemplate} from '../model/meeting-template';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {service_name} from '../../../../constant/service-name.properties';
import {master_settings_paths} from '../../../../constant/service-path.properties';
import {ResponseDataModel} from '../../../core/response-data.model';
import {MeetingAttachment} from '../../../model/meeting-attachment';

@Injectable({
  providedIn: 'root'
})

export class MeetingTemplateService extends MasterService<MeetingTemplate> {

  END_POINT_UPLOAD = 'upload';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, master_settings_paths.TEMPLATES);
  }

  upload(dto: FormData): Observable<ResponseDataModel<MeetingAttachment[]>> {
    return this.http.post<ResponseDataModel<MeetingAttachment[]>>(
      this.getUrl() + this.END_POINT_UPLOAD,
      dto
    );
  }

  isValid(dto: MeetingTemplate[]) {
  }
}
