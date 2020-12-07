import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guest} from '../models/guest';
import {MasterService} from '../../core/master.service';
import {Observable} from 'rxjs';
import {ResponseDataModel} from '../../core/response-data.model';
import {PageableModel} from '../../core/pageable.model';
import {service_name} from '../../../constant/service-name.properties';
import {guests_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class GuestsService extends MasterService<Guest> {

  END_POINT_AUTOCOMPLETE = 'autocomplete';

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_GUESTS, guests_paths.GUESTS);
    // super(http, ':8505', '/guests');
  }

  autoComplete(dto: Guest): Observable<ResponseDataModel<PageableModel<Guest>>> {
    return this.http.post<ResponseDataModel<PageableModel<Guest>>>(
      this.getUrl() + this.END_POINT_AUTOCOMPLETE,
      dto
    );
  }

  isValid(dto: Guest[]): boolean {
    return false;
  }
}
