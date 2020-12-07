import {Injectable} from '@angular/core';
import {MeetingAttachment} from '../../model/meeting-attachment';
import {HttpClient} from '@angular/common/http';
import {MasterService} from '../../core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {doc_management_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class MeetingAttachmentService extends MasterService<MeetingAttachment> {

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.ATTACHMENTS);
    // super(http, ':8504', '/attachments');
   // this.serviceName = 'mem-service-doc-management';
  }

  isValid(dto: MeetingAttachment[]) {
  }

}
