import {Component, Inject, OnInit} from '@angular/core';
import {MasterComponent} from '../../../../core/master.component';
import {MeetingTemplate} from '../../model/meeting-template';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingTemplateService} from '../../service/meeting-template.service';
import {AuthenticationService} from '../../../../../shared/security/service/authentication.service';
import {DialogModel} from '../../../../core/master-list.component';
import {attachment_type} from '../../../../../constant/attachment-type';

@Component({
  selector: 'app-template',
  templateUrl: 'create-template.component.html',
  styleUrls: []
})

export class CreateTemplateComponent extends MasterComponent<MeetingTemplate>
  implements OnInit {
  file: File;
  templateOptions =
    [{value: attachment_type.NOTICE, label: 'নোটিশ​'},
      {value: attachment_type.RESOLUTION, label: 'কার্যবিবরণী'},
      {value: attachment_type.ATTENDANCE, label: 'উপস্থিতি'},
      {value: attachment_type.HONORARIUM, label: 'সম্মানী'}];

  constructor(
    public dialogRef: MatDialogRef<CreateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<MeetingTemplate>,
    protected service: MeetingTemplateService,
    protected authenticationService: AuthenticationService,
    protected snackbar: MatSnackBar) {
    super(service, null, snackbar);
  }

  ngOnInit(): void {
  }

  cancelTemplate() {
    this.dialogRef.close();
  }

  submitFile(event) {
    this.file = event['srcElement'].files[0];
    this.data.dto.templateTitle = this.file.name;
  }

  uploadTemplate() {
    let isTemplateValid;
    const isTypeValid = !(this.data.dto.templateType === null || this.data.dto.templateType === undefined);
    const isTitleValid = !(this.data.dto.templateTitle === null || this.data.dto.templateTitle === undefined);
    const isFileValid = !(this.file === null || this.file === undefined);

    if (isTypeValid === false) {
      this.snackbar.open('দ​য়া করে টেমপ্লেটের ধরন লিখুন​')._dismissAfter(3000);
    }

    if (isTitleValid === false) {
      this.snackbar.open('দ​য়া করে টেমপ্লেটের নাম​ লিখুন​')._dismissAfter(3000);
    }

    if (isFileValid === false) {
      this.snackbar.open('দ​য়া করে একটি টেমপ্লেট আপলোড করুন​')._dismissAfter(3000);
    }

    isTemplateValid = isTypeValid && isTitleValid && isFileValid;

    if (isTemplateValid) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('title', this.data.dto.templateTitle);
      formData.append('attachmentType', this.data.dto.templateType);
      formData.append('description', '');
      formData.append('requestOid', 'template');
      formData.append('createdBy', this.authenticationService.currentUserValue.employeeOfficeId);
      this.service.upload(formData).subscribe(res => {
        if (res.status !== 200) {
          this.snackbar.open('টেমপ্লেট আপলোড ব্যর্থ হ​য়েছে')._dismissAfter(3000);
          return;
        }
        this.snackbar.open('টেমপ্লেট আপলোড সফলভাবে সম্পন্ন হ​য়েছে')._dismissAfter(3000);
        this.dialogRef.close(res.data[0]);
      });
    }
  }
}
