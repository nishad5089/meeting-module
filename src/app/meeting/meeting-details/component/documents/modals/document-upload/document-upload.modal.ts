import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MeetingAttachment} from '../../../../../model/meeting-attachment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-upload-dialog',
  templateUrl: './document-upload.modal.html',
})
export class DocumentUploadDialogComponent {

  workingFileOrGo = [
    {label: 'কার্যপত্র​', type: 'wp'},
    {label: 'সরকারি আদেশ​', type: 'go'}
  ];

  constructor(
    protected snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<DocumentUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {attachment: MeetingAttachment, file: File}
    ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNew(event) {
    if (event['srcElement'].files[0]) {
      this.data.file = event['srcElement'].files[0];
      this.data.attachment.fileTitle = this.data.file.name;
      this.data.attachment.fileType = this.data.file.type;
    } else {
      this.data.file = undefined;
      this.data.attachment.fileTitle = undefined;
      this.data.attachment.fileType = undefined;
    }
  }

  upload() {
    if (this.data.file === undefined) {
      this.snackbar.open('দয়া করে একটি ফাইল আপলোড করুন')._dismissAfter(3000);
      return;
    }
    this.dialogRef.close(this.data);
  }
}
