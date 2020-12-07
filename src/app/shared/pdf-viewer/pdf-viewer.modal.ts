import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingService} from '../../meeting/service/meeting.service';
import {MeetingDetailsService} from '../../meeting/service/meeting-details.service';
import {NoticeForwardingInfoService} from '../../meeting/meeting-details/service/notice-forwarding-info.service';
import {FileManagementService} from '../../meeting/service/file-management.service';
import {ResolutionApprovalService} from '../../meeting/meeting-details/service/resolution-approval.service';
import {NoticeForwardingInfo} from '../../meeting/model/notice-forwarding-info';
import {ResolutionApproval} from '../../meeting/model/resolution-approval';
import {MeetingTemplateService} from '../../meeting/master-settings/meeting-template-file/service/meeting-template.service';
import {MeetingTemplate} from '../../meeting/master-settings/meeting-template-file/model/meeting-template';
import {Meeting} from '../../meeting/model/meeting';
import {MeetingDetails} from '../../meeting/model/meeting-details';
import {attachment_type} from '../../constant/attachment-type';
import {AuthenticationService} from '../security/service/authentication.service';
import {environment} from '../../../environments/environment';
import {error_message, success_message} from '../../constant/messages';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.modal.html',
  styleUrls: [
    './pdf-viewer.modal.css'
  ]
})

export class PdfViewerModalComponent {
  templates: MeetingTemplate[];
  templateOid: string;
  loading: boolean;
  resolutionMemorandumNumber: string;
  showFile = false;
  height: string;

  constructor(public dialogRef: MatDialogRef<PdfViewerModalComponent>,
              protected meetingService: MeetingService,
              protected meetingDetailsService: MeetingDetailsService,
              protected noticeForwardingInfoService: NoticeForwardingInfoService,
              protected snackbar: MatSnackBar,
              protected meetingTemplateService: MeetingTemplateService,
              protected authenticationService: AuthenticationService,
              protected fileManagementService: FileManagementService,
              protected resolutionApprovalService: ResolutionApprovalService,
              @Inject(MAT_DIALOG_DATA) public data: { oid: string, value: string, file?: File, generate: boolean }) {
    if (data.generate === true) {
      this.getTemplates(data.value);
      this.height = '65vh';
    } else {
      this.height = '70vh';
      this.showFile = true;
    }
    environment.IS_MODAL_OPEN = true;
  }

  getTemplates(type: string) {
    const dto = new MeetingTemplate();
    dto.templateType = type;
    this.loading = true;
    this.meetingTemplateService.search(dto).subscribe(x => {
      if (x.status !== 200) {
        this.snackbar.open(x.errors.error)._dismissAfter(3000);
        this.templates = [];
      }
      this.templates = x.data.content;
    },
      error1 => {},
      () => {
        this.loading = false;
      });
  }

  onNoClick() {
    environment.IS_MODAL_OPEN = false;
    this.dialogRef.close();
  }

  downloadFile(file: File = this.data.file) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = data;
    link.download = file.name;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  disabled(): boolean {
    if (this.templateOid === undefined) {
      return true;
    }
    return this.data.value === attachment_type.RESOLUTION &&
      (this.resolutionMemorandumNumber === undefined
        || this.resolutionMemorandumNumber.trim().length === 0);

  }

  createFormData(type: string): FormData {
    const formData = new FormData();
    formData.append('file', this.data.file);
    formData.append('title', type + '.pdf');
    formData.append('description', '');
    formData.append('attachmentType', type);
    formData.append('meetingOid', this.data.oid);
    formData.append('createdBy', this.authenticationService.currentUserValue.employeeOfficeId);
    return formData;
  }

  sendForApproval() {
    this.loading = true;
    const formData = this.createFormData(this.data.value);
    if (this.data.value === attachment_type.NOTICE) {
      const newForwardingInfo = new NoticeForwardingInfo();
      newForwardingInfo.meetingOid = this.data.oid;
      newForwardingInfo.approvalMethod = 'grp';
      newForwardingInfo.approvalStatus = 'pending';
      newForwardingInfo.status = 'active';
      this.noticeForwardingInfoService.create(newForwardingInfo).subscribe(response => {
          if (response.status !== 200) {
            this.snackbar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
            environment.IS_MODAL_OPEN = false;
            this.dialogRef.close();
            return;
          }
        this.fileManagementService.fileUpload(formData).subscribe(resp => {
          if (resp.status !== 200) {
            this.snackbar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
            return;
          }
          this.snackbar.open(success_message.NOTICE_SENT_FOR_APPROVAL)._dismissAfter(3000);
        }, error1 => {
          this.noticeForwardingInfoService.delete(response.data);
        }, () => {
          this.loading = false;
          environment.IS_MODAL_OPEN = false;
          this.dialogRef.close(true);
        });
        }, error1 => {
          this.loading = false;
        });
    } else if (this.data.value === attachment_type.RESOLUTION) {
      const resolutionForwardingInfo = new ResolutionApproval();
      resolutionForwardingInfo.meetingOid = this.data.oid;
      resolutionForwardingInfo.memorandumNumber = this.resolutionMemorandumNumber;
      resolutionForwardingInfo.resolutionStatus = 'pending';
      resolutionForwardingInfo.status = 'active';
      this.resolutionApprovalService.create(resolutionForwardingInfo).subscribe(response => {
          this.loading = false;
          if (response.status !== 200) {
            this.snackbar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
            this.dialogRef.close();
            return;
          }
          this.fileManagementService.fileUpload(formData).subscribe(resp => {
            if (resp.status !== 200) {
              this.snackbar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
              return;
            }
            this.snackbar.open(success_message.RESOLUTION_SENT_FOR_APPROVAL)._dismissAfter(3000);
          }, error1 => {
            this.resolutionApprovalService.delete(response.data);
          }, () => {
            this.loading = false;
            environment.IS_MODAL_OPEN = false;
            this.dialogRef.close(true);
          });
        },
        error1 => {
          this.loading = false;
        });
    }
  }

  downloadDocFile() {
    const dto: MeetingDetails = new MeetingDetails();
    dto.oid = this.data.oid;
    dto.templateOid = this.templateOid;
    this.loading = true;
    if (this.data.value === attachment_type.NOTICE) {
      this.meetingDetailsService.generateNoticeDocx(dto).subscribe(res => {
        this.downloadFile(new File([res], 'Meeting_Notice.docx'));
      },
        error1 => {},
        () => {
          this.loading = false;
        });
    } else if (this.data.value === attachment_type.RESOLUTION) {
      this.meetingDetailsService.generateResolutionDocx(dto).subscribe(res => {
        this.downloadFile(new File([res], 'Meeting_Resolution.docx'));
      },
        error1 => {},
        () => {
          this.loading = false;
        });
    }

  }

  generateFile() {
    this.loading = true;
    const fileObject = {oid: this.data.oid, templateOid: this.templateOid};
    if (this.data.value === attachment_type.NOTICE) {
      this.meetingDetailsService.generateNotice(fileObject).subscribe(response => {
        this.data.file = new File([response], 'Meeting_Notice.pdf');
        this.showFile = true;
      },
        error1 => {},
        () => {
          this.loading = false;
        });
    } else if (this.data.value === attachment_type.RESOLUTION) {
      const dto = new Meeting();
      dto.oid = this.data.oid;
      dto.resolutionMemorandumNumber = this.resolutionMemorandumNumber;
      this.meetingService.update(dto).subscribe(x => {
        if (x.status !== 200) {
          this.snackbar.open(x.errors.error)._dismissAfter(3000);
          return;
        }
        this.meetingDetailsService.generateResolution(fileObject).subscribe(response => {
          this.data.file = new File([response], 'Meeting_Resolution.pdf');
          // this.data.generate = false;
          this.showFile = true;
        },
          error1 => {},
          () => {
            this.loading = false;
          });
      },
        error1 => {
          this.loading = false;
        });
    }
  }
}
