import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingInvitee} from '../../../../model/meeting-invitee';
import {FormControl} from '@angular/forms';
import {Employee} from '../../../../model/employee';
import {AuthenticationService} from '../../../../../shared/security/service/authentication.service';
import {Observable, of} from 'rxjs';
import {MemberAutocompleteService} from '../../../../../shared/service/member-autocomplete.service';
import {attendee_type} from '../../../../../constant/attendee-type';


@Component({
  selector: 'app-nomination',
  templateUrl: './nomination.component.html',
  styleUrls: [
    './nomination.component.css'
  ]
})

export class NominationComponent implements OnInit {
  myControl = new FormControl();
  filteredMembers$: Observable<Employee[]>;
  loading = false;

  constructor(public dialogRef: MatDialogRef<NominationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MeetingInvitee,
              protected authenticationService: AuthenticationService,
              protected autoCompleteService: MemberAutocompleteService,
              protected snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe(x => {
      if (typeof x !== 'string') {
        this.filteredMembers$ = of(null);
        return ;
      }
      this.filteredMembers$ = this.autoCompleteService.lookup(attendee_type.EMPLOYEE, x);
    });
  }

  displayFn(element: Employee): string {
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

  onCancelClick() {
    this.dialogRef.close();
  }

  isInvalid(): boolean {
    return (typeof this.myControl.value === 'string' ||
      this.myControl.value === null ||
      this.myControl.value === undefined);
  }

}






