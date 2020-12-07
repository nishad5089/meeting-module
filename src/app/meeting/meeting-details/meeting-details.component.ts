import {Component, OnDestroy} from '@angular/core';
import {MeetingSchedule} from '../model/meeting-schedule';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AttendanceHonorariumDialogComponent} from './modal/atttendance-honorarium-dialog/attendance-honorarium-dialog';
import {MeetingDetails} from '../model/meeting-details';
import {AttendanceService} from './service/attendance.service';
import {MeetingInviteesHonorarium} from '../model/meeting-invitees-honorarium';
import {InviteeService} from './service/invitees.service';
import {NoticeForwardingInfo} from '../model/notice-forwarding-info';
import {NoticeForwardingInfoService} from './service/notice-forwarding-info.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ResolutionApprovalService} from './service/resolution-approval.service';
import {ResolutionApproval} from '../model/resolution-approval';
import {AuthenticationService} from '../../shared/security/service/authentication.service';
import {EditAndCopyMeetingModalComponent} from './modal/edit-and-copy-meeting-dialog/edit-and-copy-meeting.modal.component';
import {RescheduleMeetingModal} from './modal/reschedule-meeting-dialog/reschedule-meeting.modal';
import {CancelMeetingModalComponent} from './modal/cancel-meeting-dialog/cancel-meeting.modal';
import {PdfViewerModalComponent} from '../../shared/pdf-viewer/pdf-viewer.modal';
import {SpeedDialFabPosition} from '../../shared/speed-dial-fab/speed-dial-fab.component';
import {MeetingService} from '../service/meeting.service';
import {MeetingInvitee} from '../model/meeting-invitee';
import {meeting_status} from '../../constant/meeting-status';
import {PermissionService} from '../master-settings/acl/permission/service/permission.service';
import {roles} from '../../constant/roles.constant';
import {Permission} from '../master-settings/acl/permission/model/permission';
import {ActionService} from '../master-settings/acl/action/service/action.service';
import {Subscription} from 'rxjs';
import {attendance_status} from '../../constant/attendee-status';
import {error_message, icon_message, info_message, success_message} from '../../constant/messages';
import {attachment_type} from '../../constant/attachment-type';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './meeting-details.component.html'
})

export class MeetingDetailsComponent implements OnDestroy {

  meetingDetails: MeetingDetails;
  meetingSchedule: MeetingSchedule = new MeetingSchedule();
  selectedIndex: number;

  meetingOid: string;
  invitees: Array<MeetingInvitee> = [];

  subscription = new Subscription();
  roomName: string;
  isLoadingResults = true;
  isBasicInfoLoaded = false;
  isInviteesLoaded = false;
  isAttachmentsLoaded = false;
  isBackgroundLoaded = false;
  permissions: Map<string, boolean> = new Map<string, boolean>();
  public speedDialFabButtons = [
    { // 0
      icon: icon_message.EDIT_MEETING,
      tooltip: info_message.EDIT_MEETING,
      show: false
    },
    { // 1
      icon: icon_message.COPY_MEETING,
      tooltip: info_message.COPY_MEETING,
      show: false
    },
    { // 2
      icon: icon_message.PREPARE_NOTICE,
      tooltip: info_message.PREPARE_NOTICE,
      show: false
    },
    { // 3
      icon: icon_message.TAKE_ATTENDANCE,
      tooltip: info_message.TAKE_ATTENDANCE,
      show: false
    },
    { // 4
      icon: icon_message.CANCEL_MEETING,
      tooltip: info_message.CANCEL_MEETING,
      show: false
    },
    { // 5
      icon: icon_message.RESCHEDULE_MEETING,
      tooltip: info_message.RESCHEDULE_MEETING,
      show: false
    },
    { // 6
      icon: icon_message.SEND_NOTICE_FOR_APPROVAL,
      tooltip: info_message.SEND_NOTICE_FOR_APPROVAL,
      show: false
    },
    { // 7
      icon: icon_message.CIRCULATE_NOTICE,
      tooltip: info_message.CIRCULATE_NOTICE,
      show: false
    },
    { // 8
      icon: icon_message.PREPARE_RESOLUTION,
      tooltip: info_message.PREPARE_RESOLUTION,
      show: false
    },
    { // 9
      icon: icon_message.SEND_RESOLUTION_FOR_APPROVAL,
      tooltip: info_message.SEND_RESOLUTION_FOR_APPROVAL,
      show: false
    },
    { // 10
      icon: icon_message.CIRCULATE_RESOLUTION,
      tooltip: info_message.CIRCULATE_RESOLUTION,
      show: false
    }
  ];

  speedDialFabPosition = SpeedDialFabPosition.Top;

  constructor(private meetingService: MeetingService,
              private meetingAttendanceService: AttendanceService,
              private attendanceDialog: MatDialog,
              protected dialog: MatDialog,
              protected inviteesService: InviteeService,
              private snackbar: MatSnackBar,
              protected noticeForwardingInfoService: NoticeForwardingInfoService,
              protected resolutionApprovalService: ResolutionApprovalService,
              protected authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              protected permissionService: PermissionService) {
    this.meetingDetails = new MeetingDetails();
    this.meetingOid = route.snapshot.paramMap.get('oid');

    this.subscription = this.meetingService.meetingDetailsTabIndex.subscribe(tabIndex => {
      this.selectedIndex = tabIndex > -1 ? tabIndex : 1;
    });
  }

  getOwnershipStatus(): string {
    if (this.meetingDetails.creator.oid === this.authenticationService.currentUserValue.employeeOfficeId) {
      return roles.MEM_MEETING_CREATOR;
    } else if (this.meetingDetails.invitees) {
      const invitee = this.meetingDetails.invitees.filter
      (inv => inv.memberOid === this.authenticationService.currentUserValue.employeeOfficeId);
      if (invitee[0]) {
        return invitee[0].ownershipStatus;
      }
    }
    return '';
  }

  getPermissions(): void {
    this.isLoadingResults = true;
    this.permissionService.getPermissions(new Permission({
      roleTag: this.getOwnershipStatus(),
      combinedMeetingStatus: this.meetingDetails.meetingStatus
    }))
      .subscribe(x => {
        if (x.data) {
          this.permissions = x.data;
        }
        this.setActions();
      }, error => {
      }, () => {
        this.isLoadingResults = false;
      });
  }

  setMeetingBackground(event) {
    this.meetingDetails.setBackground(event);
    this.isBackgroundLoaded = true;
    if (this.setLoading()) {
      this.getPermissions();
    }
  }

  setMeetingBasicInfo(event) {
    this.meetingDetails.setBasicInfo(event);
    this.isBasicInfoLoaded = true;
    if (this.setLoading()) {
      this.getPermissions();
    }
  }

  setMeetingInvitees(event) {
    this.meetingDetails.invitees = event;
    this.invitees = event;
    this.meetingDetails.invitees.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
    this.isInviteesLoaded = true;
    if (this.setLoading()) {
      this.getPermissions();
    }
  }

  setMeetingAttachments(event) {
    this.meetingDetails.attachments = event;
    this.isAttachmentsLoaded = true;
    if (this.setLoading()) {
      this.getPermissions();
    }
  }

  setLoading() {
    this.isLoadingResults = !(this.isInviteesLoaded && this.isBasicInfoLoaded
      && this.isBackgroundLoaded && this.isAttachmentsLoaded);
    return !this.isLoadingResults;
  }

  setLoadingEvent(event: boolean) {
    this.isLoadingResults = event;
  }

  openAttendanceHonorarium(attendances: MeetingInviteesHonorarium[]): void {
    this.attendanceDialog.open(AttendanceHonorariumDialogComponent, {
      width: '90%',
      height: '95%',
      data: attendances
    });
  }

  hasPermission(actionTag: string) {
    return this.permissions.hasOwnProperty(actionTag) && this.permissions[actionTag];
  }

  setActions() {
    this.speedDialFabButtons[0].show = this.hasPermission(ActionService.ACTION_MEETING_EDIT);
    this.speedDialFabButtons[1].show = this.hasPermission(ActionService.ACTION_MEETING_COPY);
    this.speedDialFabButtons[2].show = this.hasPermission(ActionService.ACTION_MEETING_NOTICE_PREPARE);
    this.speedDialFabButtons[3].show = this.hasPermission(ActionService.ACTION_MEETING_ATTENDANCE);
    this.speedDialFabButtons[4].show = this.hasPermission(ActionService.ACTION_MEETING_CANCEL);
    this.speedDialFabButtons[5].show = this.hasPermission(ActionService.ACTION_MEETING_RESCHEDULE);
    this.speedDialFabButtons[6].show = this.hasPermission(ActionService.ACTION_MEETING_NOTICE_APPROVE);
    this.speedDialFabButtons[7].show = this.hasPermission(ActionService.ACTION_MEETING_NOTICE_CIRCULATE);
    this.speedDialFabButtons[8].show = this.hasPermission(ActionService.ACTION_MEETING_RESOLUTION_PREPARE);
    this.speedDialFabButtons[9].show = this.hasPermission(ActionService.ACTION_MEETING_RESOLUTION_APPROVE);
    this.speedDialFabButtons[10].show = this.hasPermission(ActionService.ACTION_MEETING_RESOLUTION_CIRCULATE);
  }

  getBackgroundInfo(event) {
    this.setMeetingBackground(event);
  }

  getBasicInfo(event) {
    this.setMeetingBasicInfo(event);
  }

  getInviteesInfo(event) {
    this.setMeetingInvitees(event);
  }

  getAttachmentInfo(event) {
    this.setMeetingAttachments(event);
  }

  getStatus(): string {
    if (this.meetingDetails.oid) {
      const statusObject = meeting_status.get(this.meetingDetails.meetingStatus.toLocaleUpperCase());
      if (statusObject) {
        return statusObject['label'];
      }
    }
  }

  getColorClass(): string {
    if (this.meetingDetails.oid) {
      const statusObject = meeting_status.get(this.meetingDetails.meetingStatus.toLocaleUpperCase());
      if (statusObject) {
        return statusObject['color'];
      }
    }
  }

  setIndex(event) {
    this.selectedIndex = 1;
  }

  processAttendance(attendance: MeetingInviteesHonorarium[]): MeetingInviteesHonorarium[] {
    const attendanceLength = attendance.length;
    const payableInvitees = this.meetingDetails.invitees
      .filter(inv => inv.ownershipStatus !== roles.MEM_NON_MEMBER);
    const payableInviteesLength = payableInvitees.length;
    const attInvitees = attendance.map(att => att.meetingInviteeOid);

    if (attendanceLength === payableInviteesLength) {
      payableInvitees.forEach(inv => {
        attendance.find(att => att.meetingInviteeOid === inv.oid).serialNo = inv.serialNo;
        attendance.find(att => att.meetingInviteeOid === inv.oid).employee = inv.employee;
      });
    } else {
      payableInvitees.forEach(inv => {
        if (attInvitees.includes(inv.oid)) {
          attendance.find(att => att.meetingInviteeOid === inv.oid).serialNo = inv.serialNo;
          attendance.find(att => att.meetingInviteeOid === inv.oid).employee = inv.employee;
        } else {
          const meetingInviteesHonorarium = new MeetingInviteesHonorarium();
          meetingInviteesHonorarium.serialNo = inv.serialNo;
          meetingInviteesHonorarium.meetingOid = inv.meetingOid;
          meetingInviteesHonorarium.meetingInviteeOid = inv.oid;
          meetingInviteesHonorarium.createdBy = this.authenticationService.currentUserValue.employeeOfficeId;
          meetingInviteesHonorarium.employee = inv.employee;
          meetingInviteesHonorarium.attendanceStatus = attendance_status.ABSENT;
          meetingInviteesHonorarium.honorarium = 0;
          attendance.push(meetingInviteesHonorarium);
        }
      });
    }
    attendance.sort((a, b) => a.serialNo > b.serialNo ? 1 : -1);
    return attendance;
  }

  getUrl(): string {
    let url = window.location.href;
    url = url.substr(0, url.lastIndexOf('\/'));
    return url;
  }

  onSpeedDialFabClicked(btn: {
    show: boolean;
    icon: string, tooltip: string
  }) {
    if (btn.icon === icon_message.EDIT_MEETING) {
      this.dialog.open(EditAndCopyMeetingModalComponent, {
        width: '60%',
        data: {type: icon_message.EDIT_MEETING, meeting: this.meetingDetails}
      }).afterClosed().subscribe(result => {
        if (result) {
          environment.IS_MODAL_OPEN = false;
          location.reload();
        }
      });
    } else if (btn.icon === icon_message.COPY_MEETING) {
      this.dialog.open(EditAndCopyMeetingModalComponent, {
        width: '60%',
        data: {type: 'copy', meeting: this.meetingDetails}
      }).afterClosed().subscribe(result => {
        if (result) {
          environment.IS_MODAL_OPEN = false;
          let detailsBase = this.getUrl();
          detailsBase += '/' + result.oid;
          location.replace(detailsBase);
        }
      });
    } else if (btn.icon === icon_message.RESCHEDULE_MEETING) {
      this.dialog.open(RescheduleMeetingModal, {
        width: '60%',
        data: this.meetingDetails
      }).afterClosed().subscribe(result => {
        if (result) {
          environment.IS_MODAL_OPEN = false;
          location.reload();
        }
      });
    } else if (btn.icon === icon_message.TAKE_ATTENDANCE) {
      this.isLoadingResults = true;
      this.meetingAttendanceService
        .search(new MeetingInviteesHonorarium(this.meetingDetails.oid), this.meetingDetails.invitees.length)
        .subscribe(
          response => {
            this.openAttendanceHonorarium(this.processAttendance(response.data.content));
          },
          error1 => {
          },
          () => {
            this.isLoadingResults = false;
          }
        );
    } else if (btn.icon === icon_message.PREPARE_NOTICE && btn.tooltip === info_message.PREPARE_NOTICE) {

      const dialogRef = this.dialog.open(PdfViewerModalComponent, {
        width: '80%',
        height: '95vh',
        data: {oid: this.meetingOid, value: attachment_type.NOTICE, generate: true}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          environment.IS_MODAL_OPEN = false;
          location.reload();
        }
      });
    } else if (btn.icon === icon_message.CIRCULATE_NOTICE && btn.tooltip === info_message.CIRCULATE_NOTICE) {

      this.isLoadingResults = true;
      this.inviteesService.sendNotification(this.meetingDetails.invitees).subscribe(response => {
          if (response.status !== 200) {
            this.snackbar.open(response.errors)._dismissAfter(3000);
            return;
          }
          this.snackbar.open(success_message.NOTICE_CIRCULATED_SUCCESSFULLY)._dismissAfter(3000);
          location.reload();
        },
        error1 => {
        },
        () => {
          this.isLoadingResults = false;
        });

    } else if (btn.icon === icon_message.PREPARE_RESOLUTION && btn.tooltip === info_message.PREPARE_RESOLUTION) {

      this.dialog.open(PdfViewerModalComponent, {
        width: '80%',
        height: '95vh',
        data: {oid: this.meetingOid, value: attachment_type.RESOLUTION, generate: true}
      }).afterClosed().subscribe(result => {
        if (result !== undefined) {
          environment.IS_MODAL_OPEN = false;
          location.reload();
        }
      });
    } else if (btn.icon === icon_message.CIRCULATE_RESOLUTION && btn.tooltip === info_message.CIRCULATE_RESOLUTION) {

      this.isLoadingResults = true;
      this.inviteesService.sendResolution(this.meetingDetails.invitees).subscribe(response => {
        this.isLoadingResults = false;
        if (response.status !== 200) {
          this.snackbar.open(response.errors)._dismissAfter(3000);
          return;
        }
        this.snackbar.open(success_message.RESOLUTION_CIRCULATED_SUCCESSFULLY)._dismissAfter(3000);
        location.reload();
      });

    } else if (btn.icon === icon_message.SEND_NOTICE_FOR_APPROVAL && btn.tooltip === info_message.SEND_NOTICE_FOR_APPROVAL) {
      const newForwardingInfo = new NoticeForwardingInfo();
      newForwardingInfo.meetingOid = this.meetingOid;
      newForwardingInfo.approvalMethod = 'grp';
      this.noticeForwardingInfoService.create(newForwardingInfo).subscribe(response => {
        if (response.status !== 200) {
          this.snackbar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
          return;
        }
        this.snackbar.open(success_message.NOTICE_SENT_FOR_APPROVAL)._dismissAfter(3000);
        location.reload();
      });
    } else if (btn.icon === icon_message.SEND_RESOLUTION_FOR_APPROVAL && btn.tooltip === info_message.SEND_RESOLUTION_FOR_APPROVAL) {
      const resolutionForwardingInfo = new ResolutionApproval();
      resolutionForwardingInfo.meetingOid = this.meetingOid;
      resolutionForwardingInfo.memorandumNumber = this.meetingDetails.resolutionMemorandumNumber;
      this.resolutionApprovalService.create(resolutionForwardingInfo).subscribe(response => {
        if (response.status !== 200) {
          this.snackbar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
          return;
        }
        this.snackbar.open(success_message.RESOLUTION_SENT_FOR_APPROVAL)._dismissAfter(3000);
        location.reload();
      });
    } else if (btn.icon === icon_message.CANCEL_MEETING && btn.tooltip === info_message.CANCEL_MEETING) {
      const dialogRef = this.dialog.open(CancelMeetingModalComponent, {
        width: '60%',
        data: this.meetingDetails
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          environment.IS_MODAL_OPEN = false;
          location.reload();
        }
      });
    }
  }

  hideFabs(): boolean {
    return this.speedDialFabButtons.filter(x => x.show === true).length === 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
