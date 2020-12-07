import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Approval} from '../../model/approval';
import {ResolutionConfirmationDialogComponent} from './confirmation-dialog/resolution-confirmation-dialog.component';
import {MeetingInvitee} from '../../../model/meeting-invitee';
import {MeetingDetails} from '../../../model/meeting-details';
import {AuthenticationService} from '../../../../shared/security/service/authentication.service';
import {MeetingAttachment} from '../../../model/meeting-attachment';
import {ResolutionApproval} from '../../../model/resolution-approval';
import {TodosService} from '../../services/todos.service';
import {ResolutionApprovalService} from '../../../meeting-details/service/resolution-approval.service';
import {MeetingAttachmentService} from '../../../meeting-details/service/meeting-attachment.service';
import {PdfViewerModalComponent} from '../../../../shared/pdf-viewer/pdf-viewer.modal';
import {CmnFileService} from '../../../service/cmn-file.service';
import {error_message, success_message} from '../../../../constant/messages';
import {attachment_type} from '../../../../constant/attachment-type';

@Component({
  selector: 'app-resolution-approval',
  templateUrl: './resolution-approval.component.html',
  styleUrls: [
    './resolution-approval.component.css'
  ]
})

export class ResolutionApprovalComponent implements OnInit {
  resolutionApprovals: Array<Approval>;
  dataSource: MatTableDataSource<Approval>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayColumns: string[] = ['serialNo', 'meetingTitle', 'dateTime', 'status', 'actions'];
  @Output() sendPendingResolutionApproval = new EventEmitter<number>();

  isLoadingResults = false;

  constructor(private cofirmationDialog: MatDialog,
              protected todosService: TodosService,
              protected cmnFileService: CmnFileService,
              protected resolutionApprovalService: ResolutionApprovalService,
              private snackbar: MatSnackBar,
              protected meetingAttachmentService: MeetingAttachmentService,
              private authenticationService: AuthenticationService) {
    this.resolutionApprovals = new Array<Approval>();
  }

  ngOnInit() {
    const newInvitee = new MeetingInvitee();
    newInvitee.memberOid = this.authenticationService.currentUserValue.employeeOfficeId;
    // newInvitee.memberOid = localStorage.getItem('currentUser');
    this.isLoadingResults = true;
    this.todosService.getPendingResolutionRequests(newInvitee).subscribe(response => {
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
        this.resolutionApprovals.push(newApproval);
      });
      this.dataSource = new MatTableDataSource(this.resolutionApprovals);
      if (this.dataSource.data.length > 1) {
        this.dataSource.data.sort((a, b) => {
          // @ts-ignore
          return a.meetingStartTime - b.meetingStartTime;
        });
      }
      this.sendPendingResolutionApproval.emit(this.resolutionApprovals.length);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }

  openConfirmationDialog(element, value) {
    const dialogRef = this.cofirmationDialog.open(ResolutionConfirmationDialogComponent, {
      width: '30%',
      data: {value: value, meetingName: element.meetingTitle}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const resolutionApproval = new ResolutionApproval();
        resolutionApproval.oid = element.noticeForwardingInfoOid;
        if (result.value === 'approve') {
          resolutionApproval.resolutionStatus = 'approved';
          resolutionApproval.comment = result.comment;
        } else {
          resolutionApproval.resolutionStatus = 'sent_for_correction';
          resolutionApproval.comment = result.comment;
        }
        this.isLoadingResults = true;
        this.resolutionApprovalService.updateResolutionApproval(resolutionApproval).subscribe(response => {
          let MSG;
          resolutionApproval.resolutionStatus === 'approved' ?
            MSG = success_message.APPROVE_RESOLUTION : MSG = success_message.SEND_RESOLUTION_FOR_CORRECTION;
          if (response.status !== 200) {
            this.snackbar.open(error_message.FAILURE)._dismissAfter(3000);
            return;
          }
          this.snackbar.open(MSG)._dismissAfter(3000);
          if (result.value === 'approve') {
            element.meetingStatus = 'resolution_approved';
          } else {
            element.meetingStatus = 'resolution_sent_for_correction';
          }
          this.resolutionApprovals.splice(this.resolutionApprovals.indexOf(element), 1);
          this.sendPendingResolutionApproval.emit(this.resolutionApprovals.length);
          this.dataSource = new MatTableDataSource(this.resolutionApprovals);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
    attachment.attachmentType = attachment_type.RESOLUTION;
    attachment.meetingOid = row.meetingOid;
    this.isLoadingResults = true;
    this.meetingAttachmentService.search(attachment).subscribe(res => {
      if (res.status !== 200) {
        this.snackbar.open(res.errors)._dismissAfter(3000);
        return;
      }
      attachment = res.data.content[0];
      this.cmnFileService.downloadFile({oid: attachment.fileOid}).subscribe( data => {
        const file = new File([data], 'Resolution.pdf');
        const dialogRef = this.cofirmationDialog.open(PdfViewerModalComponent, {
          width: '80%',
          height: 'auto',
          data: {oid: attachment.meetingOid, value: 'file', file: file, generate: false}
        });
      });
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }
}
