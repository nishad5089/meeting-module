import {AfterContentInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MeetingInviteesHonorarium} from '../../../model/meeting-invitees-honorarium';
import {MeetingDetails} from '../../../model/meeting-details';
import {MeetingDetailsService} from '../../../service/meeting-details.service';
import {attendance_status} from '../../../../constant/attendee-status';
import {AttendanceService} from '../../service/attendance.service';
import * as _ from 'lodash';
import {MeetingTemplateService} from '../../../master-settings/meeting-template-file/service/meeting-template.service';
import {MeetingTemplate} from '../../../master-settings/meeting-template-file/model/meeting-template';
import {attachment_type} from '../../../../constant/attachment-type';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-attendance-honorarium-dialog',
  templateUrl: 'attendance-honorarium-dialog.html',
  styleUrls: [
    'attendance-honorarium-dialog.css'
  ]
})

export class AttendanceHonorariumDialogComponent implements OnInit, AfterContentInit {

  dataSource: MatTableDataSource<MeetingInviteesHonorarium>;
  displayedColumns: string[] = ['serialNo', 'member', 'attendance', 'honorarium', 'tax', 'stampFee', 'payable'];
  selection = new SelectionModel<MeetingInviteesHonorarium>(true, []);
  taxRate: number;
  revenueStampFee: number;
  isAllChecked = false;
  meetingOid: any;
  loading = false;
  defaultValue: number;
  copy: Array<MeetingInviteesHonorarium>;
  templates: {attendance: string, honorarium: string} = {attendance: undefined, honorarium: undefined};

  constructor(
    public dialogRef: MatDialogRef<AttendanceHonorariumDialogComponent>,
    protected meetingDetailsService: MeetingDetailsService,
    protected attendanceService: AttendanceService,
    protected meetingTemplateService: MeetingTemplateService,
    protected snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Array<MeetingInviteesHonorarium>) {
    this.taxRate = this.getCurrentTaxRate();
    this.revenueStampFee = this.getCurrentRevenueStamp();
    environment.IS_MODAL_OPEN = true;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.copy = _.cloneDeep(this.dataSource.data);

    this.meetingTemplateService.search(new MeetingTemplate(attachment_type.ATTENDANCE))
      .subscribe(res => {
        this.templates.attendance = res.data.content[0].fileOid;
      }, error1 => {
      }, () => {
        this.loading = false;
      });

    this.meetingTemplateService.search(new MeetingTemplate(attachment_type.HONORARIUM))
      .subscribe(res => {
        this.templates.honorarium = res.data.content[0].fileOid;
      }, error1 => {
      }, () => {
        this.loading = false;
      });
  }

  ngAfterContentInit(): void {
    this.isAllChecked = this.isAllAttended();
  }

  onNoClick(): void {
    environment.IS_MODAL_OPEN = false;
    this.dialogRef.close();
  }

  getTotalHonorarium() {
    return this.dataSource.data
      .map(att => att.honorarium)
      .reduce((a, b) => a + b, 0);
  }

  getTotalTax() {
    let totalTax = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      totalTax += this.dataSource.data[i].taxDuty;
    }
    return totalTax;
  }

  getTotalStampFee() {
    let totalStampFee = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      totalStampFee += this.dataSource.data[i].stampDuty;
    }
    return totalStampFee;
  }

  getTotalPayable(): number {
    let totalPayable = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      totalPayable += this.dataSource.data[i].totalReceivable;
    }
    return totalPayable;
  }


  changeAttendance(row) {
    if (row.attendanceStatus === attendance_status.PRESENT) {
      row.attendanceStatus = attendance_status.ABSENT;
      row.honorarium = 0;
      this.selection.deselect(row);
    } else {
      row.attendanceStatus = attendance_status.PRESENT;
      row.honorarium = this.defaultValue ? this.defaultValue : 0;
      this.selection.select(row);
    }
    this.isAllChecked = this.isAllAttended();
  }

  checkAttendance(row) {
    if (row.attendanceStatus === attendance_status.PRESENT) {
      this.selection.select(row);
      return true;
    } else {
      this.selection.deselect(row);
      return false;
    }
  }

  isAllAttended() {
    return this.dataSource.data
      .filter(att => att.attendanceStatus === attendance_status.PRESENT)
      .length === this.dataSource.data.length;
  }

  makeAllUnattended() {
    this.selection.clear();

    this.dataSource.data.forEach(att => {
      att.attendanceStatus = attendance_status.ABSENT;
      att.honorarium = 0;
      this.selection.deselect(att);
    });

    this.isAllChecked = false;
  }

  makeAllAttended() {
    this.selection.clear();

    this.dataSource.data.forEach(att => {
      att.attendanceStatus = attendance_status.PRESENT;
      att.honorarium = this.defaultValue ? this.defaultValue : 0;
      this.selection.select(att);
    });

    this.isAllChecked = true;
  }

  masterToggle() {
    this.isAllAttended() ?
      this.makeAllUnattended() :
      this.makeAllAttended();
  }

  getCurrentTaxRate(): number {
    return (this.dataSource &&
      this.dataSource.data !== undefined &&
      this.dataSource.data.length > 0 &&
      this.dataSource.data[0].taxDuty)
      ? Math.round(this.dataSource.data[0].taxDuty / this.dataSource.data[0].honorarium * 100) : 13;
  }

  getCurrentRevenueStamp(): number {
    return (this.dataSource &&
      this.dataSource.data !== undefined &&
      this.dataSource.data.length > 0 &&
      this.dataSource.data[0].stampDuty)
      ? this.dataSource.data[0].stampDuty : 10;
  }

  setTaxDuty(row: MeetingInviteesHonorarium) {
    if (this.taxRate) {
      row.taxDuty = row.honorarium * this.taxRate;
      row.taxDuty /= 100.0;
      row.taxDuty = Math.floor(row.taxDuty);
    } else {
      row.taxDuty = 0;
    }
    return row.taxDuty;
  }

  setStampDuty(row: MeetingInviteesHonorarium) {
    row.stampDuty = Math.round(row.honorarium > 0 && this.revenueStampFee ? this.revenueStampFee : 0);
    return row.stampDuty;
  }

  setReceivable(row: MeetingInviteesHonorarium) {
    row.totalReceivable = row.honorarium - row.taxDuty - row.stampDuty;
    if (row.totalReceivable < 0) {
      row.totalReceivable = 0;
    }
    return row.totalReceivable;

  }

  downloadReport(type: string) {
    if (_.isEqual(this.copy, this.dataSource.data) === false) {
      this.snackbar.open('দয়া করে পরিবর্তনসমূহ সংরক্ষণ করে ডাউনলোড করুন')._dismissAfter(3000);
      return;
    }

    const dto = new MeetingDetails();
    dto.oid = this.data[0].meetingOid;
    dto.templateOid = this.templates[type];
    dto.templateType = type;
    this.loading = true;
    this.meetingDetailsService.generateAttendance(dto).subscribe(content => {
        const file = new File([content], type + '_report.pdf');
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const dataFile = window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = dataFile;
        link.download = file.name;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(dataFile);
          link.remove();
        }, 300);
      },
      error1 => {
      },
      () => {
        this.loading = false;
      });
  }

  setHonorarium() {
    this.dataSource.data.forEach(attendance => {
      if (!attendance.honorarium &&
        this.defaultValue !== undefined &&
        attendance.attendanceStatus === attendance_status.PRESENT) {
        attendance.honorarium = this.defaultValue;
      }
    });
  }

  setValues(row: MeetingInviteesHonorarium) {
    this.setTaxDuty(row);
    this.setStampDuty(row);
    this.setReceivable(row);
  }

  save() {
    this.loading = true;
    this.attendanceService.createAll(this.dataSource.data).subscribe(response => {
        if (response.status !== 200) {
          this.snackbar.open('উপস্থিতি গ্রহণ ব্যর্থ হয়েছে')._dismissAfter(3000);
          return;
        }
        this.snackbar.open('উপস্থিতি গ্রহণ সফলভাবে সম্পন্ন হয়েছে')._dismissAfter(3000);
        this.dataSource.data.forEach(x => {
          response.data.forEach(y => {
            if (x.meetingInviteeOid === y.meetingInviteeOid) {
              x.oid = y.oid;
            }
          });
        });
        this.copy = _.cloneDeep(this.dataSource.data);
      },
      error1 => {
        this.snackbar.open('উপস্থিতি গ্রহণ ব্যর্থ হয়েছে')._dismissAfter(3000);
      },
      () => {
        this.loading = false;
      });
  }

  checkSaved(): boolean {
    return this.data.filter(x => x.oid).length > 0;
  }
}
