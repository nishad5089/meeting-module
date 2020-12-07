import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Employee} from '../../../model/employee';
import {Observable} from 'rxjs';
import {MemberAutocompleteService} from '../../../../shared/service/member-autocomplete.service';
import {roles} from '../../../../constant/roles.constant';

@Component({
  selector: 'app-key-personnel',
  templateUrl: './key-personnel.component.html',
})
export class KeyPersonnelComponent implements OnInit {

  @Output() formEvent = new EventEmitter<FormGroup>();
  filteredChairperson$: Observable<any> = null;
  fileredSignatory$: Observable<Employee[]> = null;
  filteredChiefGuest$: Observable<any> = null;

  key_personnel_form: FormGroup;
  options = [{value: 'internal', label: 'কর্মকর্তা/কর্মচারী'}, {value: 'guest', label: 'অতিথি'}];

  constructor(public fb: FormBuilder,
              protected memberAutocompleteService: MemberAutocompleteService) {
  }

  ngOnInit() {
    this.reactiveForm();
    this.key_personnel_form.valueChanges.subscribe(x => {
      this.submitForm();
    });
    this.filteredChairperson$ = this.memberAutocompleteService.getFormData(this.key_personnel_form, 'chairperson');
    this.fileredSignatory$ = this.memberAutocompleteService.getFormData(this.key_personnel_form, 'signatory');
    this.filteredChiefGuest$ = this.memberAutocompleteService.getFormData(this.key_personnel_form, 'chiefGuest');
    this.key_personnel_form.controls['chairpersonType'].valueChanges.subscribe(x => {
      this.key_personnel_form.controls['chairperson'].setValue('');
    });
    this.key_personnel_form.controls['chiefGuestType'].valueChanges.subscribe(x => {
      this.key_personnel_form.controls['chiefGuest'].setValue('');
    });
  }

  displayFn(element?): string {
    if (element) {
      let name = element.name;
      if (element.designationName && element.designationName.length > 0) {
        name += ', ' + element.designationName;
      }
      if (element.departmentName && element.departmentName.length > 0) {
        name += ', ' + element.departmentName;
      }
      if (element.orgName && element.orgName.length > 0) {
        name += ', ' + element.orgName;
      }
      return name;
    }
  }

  submitForm() {
    this.formEvent.emit(this.key_personnel_form);
  }

  reactiveForm() {
    this.key_personnel_form = this.fb.group({
      chairperson: [''],
      signatory: ['', [Validators.required]],
      chiefGuest: [''],
      chiefGuestType: ['internal'],
      chairpersonType: ['internal']
    });
  }

  errorHandling(name: string, required: string) {
    return this.key_personnel_form.controls[name].hasError(required);
  }

}
