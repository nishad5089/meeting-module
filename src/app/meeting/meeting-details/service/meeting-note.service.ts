import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeetingNote} from '../../model/meeting-note';
import {MasterService} from '../../core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {doc_management_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class MeetingNoteService extends MasterService<MeetingNote> {
  constructor(public http: HttpClient) {
    // super(http, ':8504', '/notes');
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.NOTES);
    // this.serviceName = 'mem-service-doc-management';
  }

  isValid(dto: MeetingNote[]) {
  }


}
