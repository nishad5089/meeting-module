import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Approval} from '../../model/approval';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {NoticeConfirmationDialogComponent} from './confirmation-dialog/notice-confirmation-dialog.component';
import {MeetingInvitee} from '../../../model/meeting-invitee';
import {MeetingDetails} from '../../../model/meeting-details';
import {AuthenticationService} from '../../../../shared/security/service/authentication.service';
import {MeetingAttachment} from '../../../model/meeting-attachment';
import {TodosService} from '../../services/todos.service';
import {NoticeForwardingInfoService} from '../../../meeting-details/service/notice-forwarding-info.service';
import {MeetingAttachmentService} from '../../../meeting-details/service/meeting-attachment.service';
import {PdfViewerModalComponent} from '../../../../shared/pdf-viewer/pdf-viewer.modal';
import {NoticeForwardingInfo} from '../../../model/notice-forwarding-info';
import {CmnFileService} from '../../../service/cmn-file.service';
import {error_message, success_message} from '../../../../constant/messages';
import {attachment_type} from '../../../../constant/attachment-type';

@Component({
  selector: 'app-notice-approval',
  templateUrl: './notice-approval.component.html',
  styleUrls: [
    './notice-approval.component.css'
  ]
})

export class NoticeApprovalComponent implements OnInit {
  noticeApprovals: Array<Approval>;
  dataSource: MatTableDataSource<Approval>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayColumns: string[] = ['serialNo', 'meetingTitle', 'dateTime', 'status', 'actions'];
  file: any;
  isLoadingResults = false;

  @Output() sendPendingNoticeApproval = new EventEmitter<number>();

  constructor(private cofirmationDialog: MatDialog,
              protected todosService: TodosService,
              protected cmnFileService: CmnFileService,
              protected noticeForwardingInfoService: NoticeForwardingInfoService,
              private snackbar: MatSnackBar,
              private authenticationService: AuthenticationService,
              protected meetingAttachmentService: MeetingAttachmentService) {
    this.noticeApprovals = new Array<Approval>();
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.noticeApprovals;
  }

  ngOnInit() {
    const newInvitee = new MeetingInvitee();
    newInvitee.memberOid = this.authenticationService.currentUserValue.employeeOfficeId;
    // newInvitee.memberOid = localStorage.getItem('currentUser');
    this.isLoadingResults = true;
    this.todosService.getPendingNoticeRequests(newInvitee).subscribe(response => {
      let data: any[];
      data = response.data;
      data.forEach(resdata => {
        const key = Object.keys(resdata)[0];
        // @ts-ignore
        const value: MeetingDetails = Object.values(resdata)[0];
        const newApproval = new Approval();
        newApproval.noticeForwardingInfoOid = key;
        newApproval.meetingOid = value.oid;
        newApproval.meetingTitle = value.meetingTitle;
        newApproval.meetingDate = value.meetingSchedule.meetingDate;
        newApproval.meetingStartTime = value.meetingSchedule.meetingStartTime;
        newApproval.meetingEndTime = value.meetingSchedule.meetingEndTime;
        newApproval.meetingStatus = value.meetingStatus;
        this.noticeApprovals.push(newApproval);
      });
      this.dataSource = new MatTableDataSource(this.noticeApprovals);
      if (this.dataSource.data.length > 1) {
        this.dataSource.data.sort((a, b) => {
          // @ts-ignore
          return a.meetingStartTime - b.meetingStartTime;
        });
      }
      this.sendPendingNoticeApproval.emit(this.noticeApprovals.length);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }

  openConfirmationDialog(element, value) {
    const dialogRef = this.cofirmationDialog.open(NoticeConfirmationDialogComponent, {
      width: '30%',
      data: {value: value, meetingName: element.meetingTitle}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const forwardingInfo = new NoticeForwardingInfo();
        forwardingInfo.oid = element.noticeForwardingInfoOid;

        if (result.value === 'approve') {
          forwardingInfo.approvalStatus = 'approved';
          forwardingInfo.comment = result.comment;
        } else {
          forwardingInfo.approvalStatus = 'sent_for_correction';
          forwardingInfo.comment = result.comment;
        }

        this.isLoadingResults = true;

        this.noticeForwardingInfoService.updateNoticeApproval(forwardingInfo).subscribe(response => {
          let MSG;
          forwardingInfo.approvalStatus === 'approved' ?
            MSG = success_message.APPROVE_NOTICE : MSG = success_message.SEND_NOTICE_FOR_CORRECTION;
          if (response.status !== 200) {
            this.snackbar.open(error_message.FAILURE)._dismissAfter(3000);
            return;
          }
          if (result.value === 'approve') {
            element.meetingStatus = 'notice_approved';
          } else {
            element.meetingStatus = 'notice_sent_for_correction';
          }
          this.noticeApprovals.splice(this.noticeApprovals.indexOf(element), 1);
          this.sendPendingNoticeApproval.emit(this.noticeApprovals.length);
          this.dataSource = new MatTableDataSource(this.noticeApprovals);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.snackbar.open(MSG)._dismissAfter(3000);
        },
          error1 => {},
          () => {
            this.isLoadingResults = false;
          });
      }
    });
  }

  getFile(row) {
    let attachment = new MeetingAttachment();
    attachment.attachmentType = attachment_type.NOTICE;
    attachment.meetingOid = row.meetingOid;
    this.isLoadingResults = true;
    this.meetingAttachmentService.search(attachment).subscribe(res => {
      if (res.status !== 200) {
        this.snackbar.open(res.errors)._dismissAfter(3000);
        return;
      }
      attachment = res.data.content[0];
      this.cmnFileService.downloadFile({oid: attachment.fileOid}).subscribe( data => {
        this.file = new File([data], 'Notice.pdf');
        const dialogRef = this.cofirmationDialog.open(PdfViewerModalComponent, {
          width: '80%',
          height: 'auto',
          data: {oid: attachment.meetingOid, value: 'file', file: this.file, generate: false}
        });
      });
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }

}
