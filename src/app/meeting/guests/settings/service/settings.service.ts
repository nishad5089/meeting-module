import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MasterService} from '../../../core/master.service';
import {Settings} from '../model/settings';
import {service_name} from '../../../../constant/service-name.properties';
import {guests_paths} from '../../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends MasterService<Settings> {

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_GUESTS, guests_paths.SETTINGS);
  }

  isValid(dto: Settings[]) {
  }
}
