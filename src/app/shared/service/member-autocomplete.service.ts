import {Injectable} from '@angular/core';
import {GuestsService} from '../../meeting/guests/service/guests.service';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {Guest} from '../../meeting/guests/models/guest';
import {Employee} from '../../meeting/model/employee';
import {EmployeeService} from './employee.service';
import {attendee_type} from '../../constant/attendee-type';
import {roles} from '../../constant/roles.constant';

@Injectable({
  providedIn: 'root'
})

export class MemberAutocompleteService {

  constructor(protected employeeService: EmployeeService,
              protected guestsService: GuestsService) {

  }

  public getFormData(form: FormGroup, type: string): Observable<any> {
    return form.controls[type].valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        let searchType = '';
        if (form.controls[type + 'Type'] !== undefined) {
          searchType = form.controls[type + 'Type'].value;
        }
        if (value !== '' && typeof value !== 'object') {
          return this.lookup(searchType, value, type);
        }
        return of(null);
      })
    );
  }

  public lookup(searchType: string, value: string, type: string = attendee_type.EMPLOYEE, officeOid: string = ''): Observable<any> {
    if (type !== 'signatory' && searchType === attendee_type.GUEST) {
      const guest = new Guest();
      guest.search = value;
      return this.guestsService.autoComplete(guest).pipe(
        // map the item property of the github results as our return object
        map(results => results.data.content),
        // catch errors
        catchError(_ => {
          return of(null);
        })
      );
    } else {
      const employee = new Employee();
      employee.name = value;
      if (officeOid) {
        employee.officeOid = officeOid;
      }
      return this.employeeService.autoComplete(employee).pipe(
        // map the item property of the github results as our return object
        map(results => results.data.content),
        // catch errors
        catchError(_ => {
          return of(null);
        })
      );
    }
  }

}
