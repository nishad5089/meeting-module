import {Injectable} from '@angular/core';
import {Building} from '../model/building';
import {HttpClient} from '@angular/common/http';
import {MasterService} from '../../../core/master.service';
import {service_name} from '../../../../constant/service-name.properties';
import {master_settings_paths} from '../../../../constant/service-path.properties';



@Injectable({
  providedIn: 'root'
})
export class BuildingService extends MasterService<Building> {

  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, master_settings_paths.BUILDINGS);
  }

  isValid(dto: Building[]): boolean {
    return false;
  }

}
