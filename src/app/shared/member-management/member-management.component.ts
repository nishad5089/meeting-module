import {Component, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {roles} from '../../constant/roles.constant';

@Component({
  selector: 'app-member-management',
  templateUrl: './member-management.component.html',
})

export class MemberManagementComponent implements OnInit {

  tabType = 'কর্মকর্তা / কর্মচারী';

  guestsOid: Array<string>;
  employeesOid: Array<string>;

  constructor(public dialogRef: MatDialogRef<MemberManagementComponent>,
              protected snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: {
    memberType: string, employeesOid: Array<string>, guestsOid: Array<string>, groupsOid: Array<string>, type: string}) {
  }

  ngOnInit(): void {
    this.guestsOid = this.data.guestsOid;
    this.employeesOid = this.data.employeesOid;
    this.data.guestsOid = [];
    this.data.employeesOid = [];
    this.data.groupsOid = [];
  }

  handleGuestEvent(event) {
    this.data.memberType = 'guest';
    this.data.guestsOid = event;
  }

  handleEmployeeEvent(event) {
    this.data.memberType = 'internal';
    this.data.employeesOid = event;
  }

  handleGroupEvent(event) {
    this.data.memberType = 'groups';
    this.data.groupsOid = event;
  }

  validateAndSave() {
    if (this.data.memberType === '') {
      this.snackbar.open('দয়া করে অন্তত একজন সদস্য নির্বাচন করুন')._dismissAfter(4000);
      return;
    }
    this.dialogRef.close(this.data);
  }

  closeModal() {
    this.dialogRef.close();
  }

  changeTab(s: string) {
    this.tabType = s;
  }

  isShowed(): boolean {
    return this.data.type === 'member' || this.data.type === roles.MEM_MEETING_MEMBER;
  }
}
