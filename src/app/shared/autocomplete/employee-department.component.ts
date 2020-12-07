import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {EmployeeAutocompleteComponent} from './employee-autocomplete.component';
import {Settings} from '../../meeting/guests/settings/model/settings';
import {OrganogramService} from '../service/organogram.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {settings} from '../../constant/settings-type';

@Component({
  selector: 'app-employee-department',
  templateUrl: './autocomplete.component.html'
})
export class EmployeeDepartmentComponent extends EmployeeAutocompleteComponent<Settings> implements OnChanges {

  @Input() isRequired: boolean;
  @Input() officeOid: string;

  constructor(protected service: OrganogramService) {
    super(service, 'বিভাগ', 'বিভাগ বাছাই করুন', new Settings());
  }

  getOptionLabel(dto: Settings): string {
    return dto ? dto.fieldNameBn : '';
  }

  protected autocomplete(value: string = ''): Observable<Array<Settings>> {
    this.dto.setEmployeeSettingsAutocomplete(value);
    this.dto.setFieldType(settings.department);
    if (this.officeOid) {
      this.dto.oid = this.officeOid;
    }
    return this.service.employeeSettingsAutoComplete(this.dto).pipe(map(response => response.data));
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.hasOwnProperty('officeOid')) {
      this.fcAutocomplete.setValue('', {emitEvent: true});
      this.changed.emit(null);
    }
    if (changes['reset'] && changes['reset'].currentValue) {
      this.fcAutocomplete.setValue('');
      this.changed.emit(null);
    }
  }

}
