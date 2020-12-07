import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {MeetingAttachment} from '../../../model/meeting-attachment';
import {Meeting} from '../../../model/meeting';
import {MeetingService} from '../../../service/meeting.service';
import {MeetingRefererence} from '../../../model/meeting-refererence';
import {attachment_type} from '../../../../constant/attachment-type';


@Component({
  selector: 'app-background',
  templateUrl: 'background.component.html',
  styleUrls: ['background.component.css']
})
export class BackgroundComponent implements OnInit {

  backgroundForm: FormGroup;
  references: Array<MeetingRefererence>;


  uploadedFiles: Array<File>;
  filesToEmit: Array<File>;
  attachments: Array<MeetingAttachment>;
  newAttachment: MeetingAttachment;
  dataSource: MatTableDataSource<MeetingAttachment>;
  meetings: Array<Meeting>;

  @Output() formEvent = new EventEmitter<FormGroup>();
  @Output() referenceEvent = new EventEmitter<Array<MeetingRefererence>>();
  displayedColumns: string[] = ['serialNo', 'fileTitle', 'actions'];

  @Output() attachmentEvent = new EventEmitter<Array<MeetingAttachment>>();
  @Output() filesEmit = new EventEmitter<Array<File>>();

  constructor(public fb: FormBuilder,
              private dialog: MatDialog,
              protected meetingService: MeetingService) {
    this.attachments = new Array<MeetingAttachment>();
    this.filesToEmit = new Array<File>();
  }

  ngOnInit(): void {
    this.createForm();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BackgroundUploadComponent, {
      width: '350px',
      data: FileList
    });

    dialogRef.afterClosed().subscribe(result => {
      this.uploadedFiles = result;
      this.upload();
    });
  }

  upload() {
    // console.log(event['srcElement'].files);
    // this.uploadedFiles = event['srcElement'].files;
    // event['srcElement'].files = new Array<File>();
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      this.newAttachment = new MeetingAttachment();
      this.newAttachment.attachmentType = attachment_type.BACKGROUND_WORKING_PAPER;
      this.newAttachment.fileTitle = this.uploadedFiles[i].name;
      this.newAttachment.fileType = this.uploadedFiles[i].type;
      this.attachments.push(this.newAttachment);
      this.filesToEmit.push(this.uploadedFiles[i]);
    }

    this.dataSource = new MatTableDataSource(this.attachments);

    this.attachmentEvent.emit(this.attachments);
    this.filesEmit.emit(this.filesToEmit);
  }

  applyFilter(value: any) {

  }

  deleteFile(event) {
    this.attachments.splice(event, 1);
    this.filesToEmit.splice(event, 1);
    this.dataSource = new MatTableDataSource(this.attachments);
  }

  submitForm(event?: Meeting[]) {
    this.references = new Array<MeetingRefererence>();

    if (event) {
      event.forEach(e => {
        const reference = new MeetingRefererence(e.oid, '', '');
        this.references.push(reference);
      });
    }

    this.referenceEvent.emit(this.references);
    this.formEvent.emit(this.backgroundForm);
  }

  createForm() {
    this.backgroundForm = this.fb.group({
      eNothiReference: [''],
      background: ['']
    });
  }

  errorHandling(name: string, error: string) {
    return this.backgroundForm.controls[name].hasError(error);
  }
}

@Component({
  selector: 'app-background-file-upload-dialog',
  templateUrl: 'background-file-upload-modal.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundUploadComponent {

  constructor(
    public dialogRef: MatDialogRef<BackgroundUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileList) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNew(event) {
    this.data = event['srcElement'].files;
  }
}
