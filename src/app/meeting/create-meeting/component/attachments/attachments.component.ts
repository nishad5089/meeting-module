import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {MeetingAttachment} from '../../../model/meeting-attachment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {attachment_type} from '../../../../constant/attachment-type';

@Component({
  selector: 'app-attachments',
  templateUrl: 'attachments.component.html',
  styleUrls: ['attachments.component.css']
})
export class AttachmentsComponent implements OnInit {
  uploadedFiles: Array<File>;
  filesToEmit: Array<File>;
  attachments: Array<MeetingAttachment>;
  newAttachment: MeetingAttachment;
  dataSource: MatTableDataSource<MeetingAttachment>;

  attachmentType: string;
  displayedColumns: string[] = ['serialNo', 'attachmentType', 'fileTitle', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Output() attachmentEvent = new EventEmitter<Array<MeetingAttachment>>();
  @Output() filesEmit = new EventEmitter<Array<File>>();
  constructor(public dialog: MatDialog) {
    this.attachmentType = 'wp';
    this.attachments = new Array<MeetingAttachment>();
    this.filesToEmit = new Array<File>();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
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
      this.newAttachment.attachmentType = attachment_type.WORKING_PAPER;
      this.newAttachment.fileTitle = this.uploadedFiles[i].name;
      // this.newAttachment.serialNo = this.attachments.length + 1;
      this.newAttachment.fileType = this.uploadedFiles[i].type;
      this.attachments.push(this.newAttachment);
      this.filesToEmit.push(this.uploadedFiles[i]);
    }

    this.dataSource = new MatTableDataSource(this.attachments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    this.attachmentEvent.emit(this.attachments);
    this.filesEmit.emit(this.filesToEmit);
  }

  ngOnInit() {
  }


  applyFilter(value: any) {

  }

  deleteFile(event) {
    this.attachments.splice(event, 1);
    this.filesToEmit.splice(event, 1);
    // for (let i = event - 1; i < this.attachments.length; i++) {
    //   this.attachments[i].serialNo--;
    // }
    this.dataSource = new MatTableDataSource(this.attachments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.attachmentEvent.emit(this.attachments);
    this.filesEmit.emit(this.filesToEmit);
  }
}

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-modal.html',
})
export class FileUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileList) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNew(event) {
    this.data = event['srcElement'].files;
  }

}
