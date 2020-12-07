import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MasterService} from '../../meeting/core/master.service';
import {Employee} from '../../meeting/model/employee';
import {ResponseDataModel} from '../../meeting/core/response-data.model';
import {PageableModel} from '../../meeting/core/pageable.model';
import {service_name} from '../../constant/service-name.properties';
import {invitee_paths} from '../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService extends MasterService<Employee> {

  AUTOCOMPLETE_END_POINT = 'autocomplete';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_INVITEES, invitee_paths.EMPLOYEES);
    // super(http, ':8503', '/employees');
  }

  isValid(dto: Employee[]) {
  }

  autoComplete(dto: Employee): Observable<ResponseDataModel<PageableModel<Employee>>> {
    return this.http.post<ResponseDataModel<PageableModel<Employee>>>(
      this.getUrl() + this.AUTOCOMPLETE_END_POINT,
      dto
    );
  }

}
