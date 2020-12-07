import {CklServiceInterface} from '../../../app/meeting/core/ckl-service-interface';
import {MasterModel} from '../../../app/meeting/core/master.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseDataModel} from '../../../app/meeting/core/response-data.model';
import {environment, IS_LIVE} from '../../../environments/environment';
import {PageableModel} from '../../../app/meeting/core/pageable.model';

export const END_POINT_SEARCH = 'get-list';
export const END_POINT_GET_ONE = 'get';
export const END_POINT_GET_SELECTED = 'get-selected';
export const END_POINT_CREATE = 'create';
export const END_POINT_CREATE_ALL = 'create-all';
export const END_POINT_UPDATE = 'update';
export const END_POINT_UPDATE_ALL = 'update-all';
export const END_POINT_DELETE = 'delete';
export const END_POINT_DELETE_ALL = 'delete-all';
export const END_POINT_AUTOCOMPLETE = 'autocomplete';

export abstract class MasterService<T extends MasterModel> implements CklServiceInterface<T> {

  protected constructor(public http: HttpClient,
                        public serviceName: string,
                        public path: string) {
  }

  static getServiceURLFromConfig(serviceName: string): string {
    let gateway_url = environment.GATEWAY_URL;
    if (IS_LIVE) {
      gateway_url += '/' + serviceName;
    }
    return gateway_url + '/' + serviceName;
  }

  abstract isValid(dto: T[]);

  getAll(dto: T): T[] {
    return [];
  }

  create(dto: T): Observable<ResponseDataModel<T>> {
    this.isValid([dto]); // if not throw exception
    return this.http.post<ResponseDataModel<T>>(this.getUrl() + END_POINT_CREATE, dto);
  }

  createAll(dto: T[]): Observable<ResponseDataModel<T[]>> {
    this.isValid(dto); // if not throw exception
    return this.http.post<ResponseDataModel<T[]>>(this.getUrl() + END_POINT_CREATE_ALL, dto);
  }

  getUrl(): string {
    return MasterService.getServiceURLFromConfig(this.serviceName) + this.path + '/';
  }

  public search(dto: MasterModel, size: number = 50, page: number = 0, sort: string = 'createdOn,desc'): Observable<ResponseDataModel<PageableModel<T>>> {
    return this.http.post<ResponseDataModel<PageableModel<T>>>(
      this.getUrl() + END_POINT_SEARCH + `?size=${size}&page=${page}&sort=${sort}`,
      dto);
  }

  public getOne(dto: T): Observable<ResponseDataModel<T>> {
    return this.http.post<ResponseDataModel<T>>(
      this.getUrl() + END_POINT_GET_ONE,
      dto);
  }

  public getSelected(oids: string[]): Observable<ResponseDataModel<T[]>> {
    return this.http.post<ResponseDataModel<T[]>>(
      this.getUrl() + END_POINT_GET_SELECTED,
     oids);
  }

  public update(dto: T): Observable<ResponseDataModel<T>> {
    return this.http.post<ResponseDataModel<T>>(
      this.getUrl() + END_POINT_UPDATE,
      dto);
  }

  public updateAll(dto: T[]): Observable<ResponseDataModel<T>> {
    return this.http.post<ResponseDataModel<T>>(
      this.getUrl() + END_POINT_UPDATE_ALL,
      dto);
  }

  public delete(dto: T): Observable<ResponseDataModel<T>> {
    return this.http.post<ResponseDataModel<T>>(
      this.getUrl() + END_POINT_DELETE,
      dto);
  }

  public deleteAll(oids: string[]): Observable<ResponseDataModel<T>> {
    return this.http.post<ResponseDataModel<T>>(
      this.getUrl() + END_POINT_DELETE_ALL,
      oids);
  }

  public employeeSettingsAutoComplete(dto: T): Observable<ResponseDataModel<T[]>> {
    return this.http.post<ResponseDataModel<T[]>>(
      this.getUrl() + END_POINT_AUTOCOMPLETE,
      dto);
  }

}
