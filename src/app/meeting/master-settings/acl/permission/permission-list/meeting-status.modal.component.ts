import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {DialogModel} from '../../../../core/master-list.component';
import {MasterComponent} from '../../../../core/master.component';
import {meeting_status} from '../../../../../constant/meeting-status';
import {Permission} from '../model/permission';
import {PermissionService} from '../service/permission.service';
import * as _ from 'lodash';

@Component({
  templateUrl: 'meeting-status.modal.component.html'
})

export class MeetingStatusModalComponent extends MasterComponent<Permission> {

  dataSource: MatTableDataSource<object> = new MatTableDataSource();
  displayColumns = ['checkBox', 'status'];
  copyStatus = [];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<MeetingStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Permission>,
    protected service: PermissionService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    data.dto.combinedMeetingStatus ?
      this.copyStatus = _.cloneDeep(this.data.dto.combinedMeetingStatus.split(',')) : this.copyStatus = [];
    this.dataSource.data = Array.from(meeting_status.values());
  }

  checkPermission(tag: string): boolean {
    return this.copyStatus.includes(tag);
  }

  onChange(tag: string) {
    this.checkPermission(tag) ? this.removeElement(tag) : this.copyStatus.push(tag) ;
  }

  removeElement(val: string) {
    this.copyStatus.splice(this.copyStatus.indexOf(val), 1);
  }

  save() {
    this.data.dto.combinedMeetingStatus = '';
    if (this.copyStatus.length > 0) {
      this.copyStatus.forEach(x => {
        this.data.dto.combinedMeetingStatus += x + ',';
      });
      this.data.dto.combinedMeetingStatus = this.data.dto.combinedMeetingStatus.slice(0, -1);
    }
    this.loading = true;
    this.service.update(this.data.dto).subscribe(res => {
      if (res.status !== 200) {
        return;
      }
      this.dialogRef.close(this.data.dto.combinedMeetingStatus);
    }, null, () => {
      this.loading = false;
    });
  }
}
