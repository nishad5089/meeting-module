import {Component, Inject, OnInit} from '@angular/core';
import {MasterAddComponent} from '../../../../../../core/master-add.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from '../../../../../../core/master-list.component';
import {UserRoles} from '../../../model/user-roles';
import {UserRolesService} from '../../../service/user-roles.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {attendee_type} from '../../../../../../../constant/attendee-type';
import {roles} from '../../../../../../../constant/roles.constant';
import {MemberAutocompleteService} from '../../../../../../../shared/service/member-autocomplete.service';
import {AuthenticationService} from "../../../../../../../shared/security/service/authentication.service";

@Component({
  templateUrl: './meeting-creator-create.component.html'
})
export class MeetingCreatorCreateComponent extends MasterAddComponent<UserRoles> implements OnInit {

  employeeField = new FormControl();
  filteredEmployee$: Observable<any> = null;

  constructor(
    public dialogRef: MatDialogRef<MeetingCreatorCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<UserRoles>,
    protected service: UserRolesService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected authenticationService: AuthenticationService,
    protected autoCompleteService: MemberAutocompleteService
  ) {
    super(service, dialog, snackbar);
  }
  ngOnInit() {
    this.initialize();
    this.data.dto.roleTag = roles.MEM_MEETING_CREATOR;
  }

  initialize() {
    this.employeeField = new FormControl(this.data.dto.employeeOid ? this.data.dto.employee : {});
    this.employeeField.valueChanges.subscribe(x => {
      if (typeof x !== 'string') {
        this.data.dto.employeeOid = x.oid;
        return;
      }
      this.data.dto.employeeOid = '';
      // ToDo if no data found for x clear input
      this.filteredEmployee$ = this.autoCompleteService.lookup(attendee_type.EMPLOYEE, x, attendee_type.EMPLOYEE, this.authenticationService.currentUserValue.officeOid);
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

}
