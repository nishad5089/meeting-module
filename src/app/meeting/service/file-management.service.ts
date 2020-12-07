import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MeetingAttachment} from '../model/meeting-attachment';
import {MasterService} from '../core/master.service';
import {service_name} from '../../constant/service-name.properties';
import {doc_management_paths} from '../../constant/service-path.properties';
import {END_POINT_UPLOAD, END_POINT_UPLOAD_EMPLOYEE_AND_GUEST_INFO_FILES} from '../../constant/api';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService extends MasterService<MeetingAttachment> {

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.FILE_MANAGEMENT);
  }

  fileUpload (formData: FormData): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + END_POINT_UPLOAD,
      formData
    );
  }

  picOrSigUpload(formData: FormData): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + END_POINT_UPLOAD_EMPLOYEE_AND_GUEST_INFO_FILES,
      formData
    );
  }

  isValid(dto: MeetingAttachment[]) {
  }
}

