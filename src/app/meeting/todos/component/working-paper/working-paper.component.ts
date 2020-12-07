import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort,
  MatTableDataSource
} from '@angular/material';
import {WorkingPaperRequest} from '../../model/working-paper-request';
import {MeetingAttachment} from '../../../model/meeting-attachment';
import {HttpClient} from '@angular/common/http';
import {MeetingInvitee} from '../../../model/meeting-invitee';
import {MeetingDetails} from '../../../model/meeting-details';
import {AuthenticationService} from '../../../../shared/security/service/authentication.service';
import {TodosService} from '../../services/todos.service';
import {FileManagementService} from '../../../service/file-management.service';
import {success_message} from '../../../../constant/messages';
import {attachment_type} from '../../../../constant/attachment-type';


@Component({
  selector: 'app-working-paper',
  templateUrl: './working-paper.component.html',
  styleUrls: [
    './working-paper.component.css'
  ]
})

export class WorkingPaperComponent implements OnInit {
  workingPaperRequests: Array<WorkingPaperRequest>;
  dataSource: MatTableDataSource<WorkingPaperRequest>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  attachment: MeetingAttachment;
  file: File;
  isLoadingResults = false;
  displayColumns: string[] = ['serialNo', 'meetingTitle', 'meetingRoomName', 'dateTime', 'actions'];

  pendingWorkingPapers = 0;

  @Output() sendPendingWorkingPapers = new EventEmitter<number>();

  constructor(private fileUploadDialog: MatDialog,
              private httpClient: HttpClient,
              private snackbar: MatSnackBar,
              protected todosService: TodosService,
              protected fileManagementService: FileManagementService,
              private authenticationService: AuthenticationService) {
    this.attachment = new MeetingAttachment();
    this.workingPaperRequests = new Array<WorkingPaperRequest>();
  }

  ngOnInit() {
    const newInvitee = new MeetingInvitee();
    newInvitee.memberOid = this.authenticationService.currentUserValue.employeeOfficeId;
    this.isLoadingResults = true;
    this.todosService.getPendingWorkingPaperRequests(newInvitee).subscribe( response => {
      if ( response.status !== 200 ) {
        return;
      }
      response.data.forEach( resData => {
        const key = Object.keys(resData)[0];
        // @ts-ignore
        const value: MeetingDetails = Object.values(resData)[0];
        const newWorkingPaper = new WorkingPaperRequest();
        newWorkingPaper.meetingOid = value.oid;
        newWorkingPaper.invitationOid = key;
        newWorkingPaper.meetingTitle = value.meetingTitle;
        newWorkingPaper.meetingRoomName = value.meetingRoom.roomName;
        newWorkingPaper.meetingDate = value.meetingSchedule.meetingDate;
        newWorkingPaper.meetingStartTime = value.meetingSchedule.meetingStartTime;
        newWorkingPaper.meetingEndTime = value.meetingSchedule.meetingEndTime;
        this.workingPaperRequests.push(newWorkingPaper);
      });
      this.dataSource = new MatTableDataSource<WorkingPaperRequest>(this.workingPaperRequests);
      if (this.dataSource.data.length > 1) {
        this.dataSource.data.sort((a, b) => {
          // @ts-ignore
          return a.meetingStartTime - b.meetingStartTime;
        });
      }
      this.sendPendingWorkingPapers.emit(this.workingPaperRequests.length);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });

  }

  openFileUploadDialog(index): void {
    const dialogRef = this.fileUploadDialog.open(WorkingPaperUploadDialogComponent, {
      width: '30%',
      data: {attachment: this.attachment, file: this.file}
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result !== undefined) {
        const formData = new FormData();
        formData.append('file', result.file);
        formData.append('title', result.attachment.fileTitle);
        formData.append('description', result.attachment.description);
        formData.append('attachmentType', result.attachment.attachmentType);
        formData.append('meetingOid', this.workingPaperRequests[index].meetingOid);
        formData.append('createdBy', 'MEM');
        this.isLoadingResults = true;
        this.fileManagementService.fileUpload(formData).subscribe( resp => {
          if (resp.status !== 200) {
            return;
          }
          const invitee = new MeetingInvitee();
          invitee.oid = this.workingPaperRequests[index].invitationOid;
          this.todosService.saveUploadedWorkingPaper(invitee).subscribe( res => {
            if ( res.status !== 200) {
              return;
            }
            this.workingPaperRequests.splice(index, 1);
            this.sendPendingWorkingPapers.emit(this.workingPaperRequests.length);
            this.dataSource = new MatTableDataSource(this.workingPaperRequests);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.snackbar.open(success_message.UPLOAD_WORKING_PAPER)._dismissAfter(4000);
          });
        });

      } else {
        this.attachment = new MeetingAttachment();
      }
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }
}

@Component({
  selector: 'app-working-paper-upload-dialog',
  templateUrl: './working-paper-upload-modal.html',
})
export class WorkingPaperUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<WorkingPaperUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {attachment: MeetingAttachment, file: File}) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNew(event) {
    this.data.file = event['srcElement'].files[0];
    this.data.attachment.fileTitle = this.data.file.name;
    this.data.attachment.attachmentType = attachment_type.RECEIVED_WORKING_PAPER;
    this.data.attachment.fileType = this.data.file.type;
  }

  preview() {
  }
}
