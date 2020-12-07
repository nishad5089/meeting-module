import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MeetingDetails} from '../../../../../app/meeting/model/meeting-details';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {MeetingNote} from '../../../../../app/meeting/model/meeting-note';
import {MeetingAgenda} from '../../../../../app/meeting/model/meeting-agenda';
import {MeetingNoteService} from '../../../../../app/meeting/meeting-details/service/meeting-note.service';
import {MeetingAgendaFollowup} from '../../../../../app/meeting/model/meeting-agenda-followup';
import {MeetingAgendaFollowupsService} from '../../../../../app/meeting/meeting-details/service/meeting-agenda-followups.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MeetingAttachment} from '../../../../../app/meeting/model/meeting-attachment';
import {AuthenticationService} from '../../../../../app/shared/security/service/authentication.service';
import {AgendaFollowupDialogComponent} from '../../../../../app/meeting/meeting-details/component/documents/modals/agenda-followup/add-agenda-followups.modal';
import {DocumentUploadDialogComponent} from '../../../../../app/meeting/meeting-details/component/documents/modals/document-upload/document-upload.modal';
import {NoteDialogComponent} from './modals/note/add-note.modal';
import {FileManagementService} from '../../../../../app/meeting/service/file-management.service';
import {MeetingDetailsService} from '../../../../../app/meeting/service/meeting-details.service';
import {MeetingService} from '../../../../../app/meeting/service/meeting.service';
import {ConfirmationComponent} from '../../../../../app/shared/confirmation/confirmation.component';
import {PdfViewerModalComponent} from '../../../../../app/shared/pdf-viewer/pdf-viewer.modal';
import {MeetingAttachmentService} from '../../../../../app/meeting/meeting-details/service/meeting-attachment.service';
import {CmnFileService} from '../../../../../app/meeting/service/cmn-file.service';
import {MeetingInvitee} from '../../../../../app/meeting/model/meeting-invitee';
import {
  ACTION_ADD_AGENDA_FOLLOWUP,
  ACTION_ADD_NOTE,
  ACTION_DELETE_AGENDA_FOLLOWUP,
  ACTION_DELETE_ATTACHMENT,
  ACTION_DELETE_BACKGROUND_FILE,
  ACTION_DELETE_FINAL_WP,
  ACTION_DELETE_NOTE,
  ACTION_DELETE_NOTICE,
  ACTION_DELETE_RECEIVED_WP,
  ACTION_DELETE_RESOLUTION,
  ACTION_EDIT_AGENDA_FOLLOWUP,
  ACTION_EDIT_NOTE,
  ACTION_UPLOAD_ATTACHMENT,
  ACTION_UPLOAD_BACKGROUND_FILE,
  ACTION_UPLOAD_FINAL_WP,
  ACTION_UPLOAD_NOTICE,
  ACTION_UPLOAD_RESOLUTION
} from '../../../../../app/constant/action-tags';
import {NoticeForwardingInfo} from '../../../model/notice-forwarding-info';
import {NoticeForwardingInfoService} from '../../service/notice-forwarding-info.service';
import {ResolutionApproval} from '../../../model/resolution-approval';
import {ResolutionApprovalService} from '../../service/resolution-approval.service';
import {Router} from '@angular/router';
import {attachment_type} from '../../../../constant/attachment-type';
import {error_message, success_message, warn_message} from '../../../../constant/messages';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {

  actionTagUploadFinalWP = ACTION_UPLOAD_FINAL_WP;
  actionTagUploadNotice = ACTION_UPLOAD_NOTICE;
  actionTagUploadBackgroundFile = ACTION_UPLOAD_BACKGROUND_FILE;
  actionTagUploadAttachment = ACTION_UPLOAD_ATTACHMENT;
  actionTagAddNote = ACTION_ADD_NOTE;
  actionTagAddAgendaFollowup = ACTION_ADD_AGENDA_FOLLOWUP;
  actionTagUploadResolution = ACTION_UPLOAD_RESOLUTION;

  actionTagDeleteNotice = ACTION_DELETE_NOTICE;
  actionTagDeleteBackgroundFile = ACTION_DELETE_BACKGROUND_FILE;
  actionTagDeleteReceivedWP = ACTION_DELETE_RECEIVED_WP;
  actionTagDeleteFinalWP = ACTION_DELETE_FINAL_WP;
  actionTagDeleteAttachment = ACTION_DELETE_ATTACHMENT;
  actionTagDeleteNote = ACTION_DELETE_NOTE;
  actionTagDeleteAgendaFollowup = ACTION_DELETE_AGENDA_FOLLOWUP;
  actionTagDeleteResolution = ACTION_DELETE_RESOLUTION;

  actionTagEditNote = ACTION_EDIT_NOTE;
  actionTagEditAgendaFollowUp = ACTION_EDIT_AGENDA_FOLLOWUP;

  @Input() meetingOid: string;
  @Input() invitees: Array<MeetingInvitee>;
  @Input() agendas: Array<MeetingAgenda>;

  @Output() attachmentEvent = new EventEmitter<Array<MeetingAttachment>>();
  @Output() loadingEvent = new EventEmitter<boolean>();

  // permissions
  @Input() permissionMap: Map<string, boolean>;


  // permissions end

  attachment: MeetingAttachment;
  file: File;


  dataSourceOfNote: MatTableDataSource<MeetingNote>;
  dataSourceOfBackgroundFiles: MatTableDataSource<MeetingAttachment>;
  dataSourceOfAttachmentFiles: MatTableDataSource<MeetingAttachment>;
  dataSourceOfWorkingPapers: MatTableDataSource<MeetingAttachment>;
  dataSourceOfFinalWorkingPaper: MatTableDataSource<MeetingAttachment>;
  dataSourceOfNotice: MatTableDataSource<MeetingAttachment>;
  dataSourceOfResolution: MatTableDataSource<MeetingAttachment>;

  noticeForwardingInfos: NoticeForwardingInfo[];
  resolutionForwardingInfos: ResolutionApproval[];
  currentNoticeComment: string = ' - ';
  currentResolutionComment: string = ' - ';

  displayedColumnsOfNotes: string[] = ['serialNo', 'agenda', 'speaker', 'note', 'actions'];
  @ViewChild('notesSort', {static: true}) sortOfNote: MatSort;

  displayedColumnsOfBackgroundFiles: string[] = ['serialNo', 'backgroundFile', 'actions'];
  @ViewChild('backgroundFilesSort', {static: true}) sortOfBackgroundFiles: MatSort;

  displayedColumnsOfAttachmentFiles: string[] = ['serialNo', 'attachmentFile', 'attachmentType', 'actions'];
  @ViewChild('attachmentFilesSort', {static: true}) sortOfAttachmentFiles: MatSort;

  displayedColumnsOfWorkingPapers: string[] = ['serialNo', 'workingPaper', 'uploadedBy', 'actions'];
  @ViewChild('workingPapersSort', {static: true}) sortOfWorkingPapers: MatSort;

  displayedColumnsOfFinalWorkingPaper: string[] = ['serialNo', 'finalWorkingPaper', 'uploadedBy', 'actions'];
  @ViewChild('finalWorkingPaperSort', {static: true}) sortOfFinalWorkingPaper: MatSort;

  displayedColumnsOfNotice: string[] = ['serialNo', 'notice', 'comment', 'actions'];
  @ViewChild('noticeSort', {static: true}) sortOfNotice: MatSort;

  displayedColumnsOfResolution: string[] = ['serialNo', 'resolution', 'comment', 'actions'];
  @ViewChild('resolutionSort', {static: true}) sortOfResolution: MatSort;

  meetingNotes: Array<MeetingNote>;
  meetingAgendaFollowups: Array<MeetingAgendaFollowup>;
  dataSourceOfFollowups: MatTableDataSource<MeetingAgendaFollowup>;
  meetingAttachments: Array<MeetingAttachment>;
  backgroundFiles: Array<MeetingAttachment>;
  attachmentFiles: Array<MeetingAttachment>;
  receivedWorkingPapers: Array<MeetingAttachment>;
  finalWorkingPapers: Array<MeetingAttachment>;
  notices: Array<MeetingAttachment>;
  resolutions: Array<MeetingAttachment>;

  displayedColumnsOfFollowups: string[] = ['dragDrop', 'serialNo', 'agenda', 'discussion', 'decision', 'responsibleEntity', 'actions'];
  @ViewChild('followUpsSort', {static: true}) sortOfFollowups: MatSort;

  constructor(
    protected meetingDetailsService: MeetingDetailsService,
    private meetingNoteService: MeetingNoteService,
    protected meetingAttachmentService: MeetingAttachmentService,
    protected meetingAgendaFollowupsService: MeetingAgendaFollowupsService,
    public dialog: MatDialog,
    private meetingService: MeetingService,
    protected snackBar: MatSnackBar,
    private fileUploadDialog: MatDialog,
    protected cmnFileService: CmnFileService,
    protected noticeForwardingInfoService: NoticeForwardingInfoService,
    protected resolutionApprovalService: ResolutionApprovalService,
    protected fileManagementService: FileManagementService,
    protected router: Router,
    protected authenticationService: AuthenticationService) {


  }

  initArrays() {
    this.attachment = new MeetingAttachment();
    this.meetingNotes = new Array<MeetingNote>();
    this.meetingAgendaFollowups = new Array<MeetingAgendaFollowup>();
    this.meetingAttachments = new Array<MeetingAttachment>();
    this.backgroundFiles = new Array<MeetingAttachment>();
    this.attachmentFiles = new Array<MeetingAttachment>();
    this.receivedWorkingPapers = new Array<MeetingAttachment>();
    this.finalWorkingPapers = new Array<MeetingAttachment>();
    this.notices = new Array<MeetingAttachment>();
    this.resolutions = new Array<MeetingAttachment>();
  }

  initDataSources() {
    this.dataSourceOfNote = new MatTableDataSource<MeetingNote>();
    this.dataSourceOfNotice = new MatTableDataSource<MeetingAttachment>();
    this.dataSourceOfBackgroundFiles = new MatTableDataSource<MeetingAttachment>();
    this.dataSourceOfAttachmentFiles = new MatTableDataSource<MeetingAttachment>();
    this.dataSourceOfWorkingPapers = new MatTableDataSource<MeetingAttachment>();
    this.dataSourceOfFollowups = new MatTableDataSource<MeetingAgendaFollowup>();
    this.dataSourceOfFinalWorkingPaper = new MatTableDataSource<MeetingAttachment>();
    this.dataSourceOfResolution = new MatTableDataSource<MeetingAttachment>();
  }

  ngOnInit() {
    this.initArrays();
    this.initDataSources();
    this.getMeetingDocuments();
    this.getComments();
  }

  populateData() {
    this.updateDataSources(this.backgroundFiles, this.dataSourceOfBackgroundFiles, this.sortOfBackgroundFiles);
    this.updateDataSources(this.attachmentFiles, this.dataSourceOfAttachmentFiles, this.sortOfAttachmentFiles);
    this.updateDataSources(this.meetingAgendaFollowups, this.dataSourceOfFollowups, this.sortOfFollowups);
    this.updateDataSources(this.finalWorkingPapers, this.dataSourceOfFinalWorkingPaper, this.sortOfFinalWorkingPaper);
    this.updateDataSources(this.resolutions, this.dataSourceOfResolution, this.sortOfResolution);
    this.updateDataSources(this.backgroundFiles, this.dataSourceOfBackgroundFiles, this.sortOfBackgroundFiles);
    this.updateDataSources(this.notices, this.dataSourceOfNotice, this.sortOfNotice);
    this.updateDataSources(this.meetingNotes, this.dataSourceOfNote, this.sortOfNote);
    this.updateDataSources(this.receivedWorkingPapers, this.dataSourceOfWorkingPapers, this.sortOfWorkingPapers);
  }

  getMeetingDocuments() {
    const meetingDetails = new MeetingDetails();
    meetingDetails.oid = this.meetingOid;
    this.meetingDetailsService.getMeetingDocuments(meetingDetails).subscribe(response => {
      this.meetingNotes = response.data.notes;
      this.meetingAgendaFollowups = response.data.agendaFollowups;

      this.meetingAttachments = response.data.attachments;
      this.attachmentEvent.emit(this.meetingAttachments);
      this.meetingAttachments.forEach(attachment => {
        if (attachment.attachmentType === attachment_type.BACKGROUND_WORKING_PAPER) {
          this.backgroundFiles.push(attachment);
        } else if (attachment.attachmentType === attachment_type.WORKING_PAPER
          || attachment.attachmentType === attachment_type.GOVERNMENT_ORDER) {
          this.attachmentFiles.push(attachment);
        } else if (attachment.attachmentType === attachment_type.RECEIVED_WORKING_PAPER) {
          this.receivedWorkingPapers.push(attachment);
        } else if (attachment.attachmentType === attachment_type.FINAL_WORKING_PAPER) {
          this.finalWorkingPapers.push(attachment);
        } else if (attachment.attachmentType === attachment_type.NOTICE) {
          this.notices.push(attachment);
        } else if (attachment.attachmentType === attachment_type.RESOLUTION) {
          this.resolutions.push(attachment);
        }
      });

      this.populateData();
    });
  }

  updateDataSources(data: Array<any>, dataSource: MatTableDataSource<any>, sort: MatSort) {
    dataSource.data = data;
    dataSource.sort = sort;
  }

  openFollowupDialog(meetingAgendaFollowup?: MeetingAgendaFollowup, index?: number) {
    this.dialog.open(AgendaFollowupDialogComponent, {
      data:
        {
          agendaFollowup: meetingAgendaFollowup ? meetingAgendaFollowup : new MeetingAgendaFollowup(),
          notes: this.meetingNotes, invitees: this.invitees, agendas: this.agendas
        }
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {

      } else {
        if (meetingAgendaFollowup === undefined) {
          result.serialNo = this.meetingAgendaFollowups.length + 1;
          this.loadingEvent.emit(true);
          this.meetingAgendaFollowupsService.create(result).subscribe(response => {
              if (response.status !== 200) {
                return;
              }
              this.meetingAgendaFollowups.push(response.data);
              this.dataSourceOfFollowups.data = this.meetingAgendaFollowups;
              this.dataSourceOfFollowups.sort = this.sortOfFollowups;
            },
            error1 => {
            },
            () => {
              this.loadingEvent.emit(false);
            });
        } else {
          this.loadingEvent.emit(true);
          this.meetingAgendaFollowupsService.update(result).subscribe(response => {
              if (response.status !== 200) {
                this.snackBar.open(response.errors)._dismissAfter(3000);
                return;
              }
              this.meetingAgendaFollowups[index] = result;
              this.dataSourceOfFollowups.data = this.meetingAgendaFollowups;
              this.snackBar.open(success_message.UPDATED_SUCCESSFULLY)._dismissAfter(3000);
            },
            error1 => {
            },
            () => {
              this.loadingEvent.emit(false);
            });
        }
      }
    });
  }

  openDocumentUploadDialog(type: string): void {
    this.attachment.attachmentType = type;
    this.fileUploadDialog.open(DocumentUploadDialogComponent, {
      width: '30%',
      data: {attachment: this.attachment, file: this.file}
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        const formData = new FormData();
        formData.append('file', result.file);
        formData.append('title', result.attachment.fileTitle);
        formData.append('description', result.attachment.description);
        formData.append('attachmentType', result.attachment.attachmentType);
        formData.append('meetingOid', this.meetingOid);
        formData.append('createdBy', this.authenticationService.currentUserValue.employeeOfficeId);
        this.loadingEvent.emit(true);
        if (result.attachment.attachmentType === attachment_type.NOTICE) {
          const newForwardingInfo = new NoticeForwardingInfo();
          newForwardingInfo.meetingOid = this.meetingOid;
          newForwardingInfo.approvalMethod = 'grp';
          newForwardingInfo.approvalStatus = 'pending';
          this.noticeForwardingInfoService.create(newForwardingInfo).subscribe(response => {
            if (response.status !== 200) {
              this.snackBar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
              return;
            }
            this.fileManagementService.fileUpload(formData).subscribe(resp => {
              if (resp.status !== 200) {
                this.snackBar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
                return;
              }
              this.snackBar.open(success_message.NOTICE_SENT_FOR_APPROVAL)._dismissAfter(3000);
              location.reload();
            }, error1 => {
              this.noticeForwardingInfoService.delete(response.data);
              this.snackBar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
            }, () => {
              this.loadingEvent.emit(false);
            });
          }, error1 => {
            this.snackBar.open(error_message.NOTICE_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
            this.loadingEvent.emit(false);
          });
        } else if (result.attachment.attachmentType === attachment_type.RESOLUTION) {
          const resolutionForwardingInfo = new ResolutionApproval();
          resolutionForwardingInfo.meetingOid = this.meetingOid;
          resolutionForwardingInfo.resolutionStatus = 'pending';
          this.resolutionApprovalService.create(resolutionForwardingInfo).subscribe(response => {
            if (response.status !== 200) {
              this.snackBar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
              return;
            }
            this.fileManagementService.fileUpload(formData).subscribe(resp => {
              if (resp.status !== 200) {
                this.snackBar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
                return;
              }
              this.snackBar.open(success_message.RESOLUTION_SENT_FOR_APPROVAL)._dismissAfter(3000);
              location.reload();
            }, error1 => {
              this.snackBar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
              this.resolutionApprovalService.delete(response.data);
            }, () => {
              this.loadingEvent.emit(false);
            });
          }, error1 => {
            this.snackBar.open(error_message.RESOLUTION_COULD_NOT_BE_SENT_FOR_APPROVAL)._dismissAfter(3000);
          }, () => {
            this.loadingEvent.emit(false);
          });
        } else {
          this.fileManagementService.fileUpload(formData).subscribe(resp => {
              if (resp.status !== 200) {
                this.snackBar.open(resp.errors)._dismissAfter(3000);
                return;
              }
              if (result.attachment.attachmentType === attachment_type.FINAL_WORKING_PAPER) {
                this.finalWorkingPapers.push(resp.data[0]);
                this.dataSourceOfFinalWorkingPaper = new MatTableDataSource(this.finalWorkingPapers);
                this.dataSourceOfFinalWorkingPaper.sort = this.sortOfFinalWorkingPaper;
              } else if (result.attachment.attachmentType === attachment_type.WORKING_PAPER
                || result.attachment.attachmentType === attachment_type.GOVERNMENT_ORDER) {
                this.attachmentFiles.push(resp.data[0]);
                this.dataSourceOfAttachmentFiles = new MatTableDataSource(this.attachmentFiles);
                this.dataSourceOfAttachmentFiles.sort = this.sortOfAttachmentFiles;
              } else if (result.attachment.attachmentType === attachment_type.BACKGROUND_WORKING_PAPER) {
                this.backgroundFiles.push(resp.data[0]);
                this.dataSourceOfBackgroundFiles = new MatTableDataSource(this.backgroundFiles);
                this.dataSourceOfBackgroundFiles.sort = this.sortOfBackgroundFiles;
              }
              this.snackBar.open(success_message.FILE_UPLOAD)._dismissAfter(3000);
            },
            error1 => {
            },
            () => {
              this.loadingEvent.emit(false);
            });
        }
      } else {
        this.attachment = new MeetingAttachment();
      }
    });
  }

  openNoteDialog(note?: MeetingNote, index?: number) {
    this.dialog.open(NoteDialogComponent, {
      data:
        {
          note: note ? note : new MeetingNote(), invitees: this.invitees, agendas: this.agendas
        }
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {
      } else {
        if (note === undefined) {
          this.loadingEvent.emit(true);
          this.meetingNoteService.create(result).subscribe(response => {
              if (response.status !== 200) {
                this.snackBar.open(response.errors)._dismissAfter(3000);
                return;
              }
              let newNote: MeetingNote;
              newNote = response.data;
              this.meetingNotes.push(newNote);
              this.dataSourceOfNote.data = this.meetingNotes;
              this.snackBar.open(success_message.CREATED_SUCCESSFULLY)._dismissAfter(3000);
            },
            error1 => {
            },
            () => {
              this.loadingEvent.emit(false);
            });
        } else {
          this.loadingEvent.emit(true);
          this.meetingNoteService.update(result).subscribe(response => {
              if (response.status !== 200) {
                this.snackBar.open(response.errors)._dismissAfter(3000);
                return;
              }
              this.meetingNotes[index] = result;
              this.dataSourceOfNote.data = this.meetingNotes;
              this.snackBar.open(success_message.UPDATED_SUCCESSFULLY)._dismissAfter(3000);
            },
            error1 => {
            },
            () => {
              this.loadingEvent.emit(false);
            });
        }
      }
    });
  }

  deleteNote(note: MeetingNote) {
    this.loadingEvent.emit(true);
    this.meetingNoteService.delete(note).subscribe(response => {
        if (response.status !== 200) {
          this.snackBar.open(response.errors)._dismissAfter(3000);
          return;
        }
        this.meetingNotes.splice(this.meetingNotes.indexOf(note), 1);

        this.dataSourceOfNote.data = this.meetingNotes;
        this.dataSourceOfNote.sort = this.sortOfNote;
        this.sortOfNote.sortChange.emit(({active: 'serialNo', direction: 'asc'}) as Sort);
        this.snackBar.open(success_message.DELETED_SUCCESSFULLY)._dismissAfter(3000);
      },
      error1 => {
      },
      () => {
        this.loadingEvent.emit(false);
      });
  }

  deleteAgendaFollowup(serialNo: any) {
    this.loadingEvent.emit(true);
    this.meetingAgendaFollowupsService.delete(this.meetingAgendaFollowups[serialNo - 1]).subscribe(response => {
        if (response.status !== 200) {
          this.snackBar.open(response.errors)._dismissAfter(3000);
          return;
        }
        this.meetingAgendaFollowups.splice(serialNo - 1, 1);
        for (let i = serialNo - 1; i < this.meetingAgendaFollowups.length; i++) {
          this.meetingAgendaFollowups[i].serialNo--;
        }

        this.dataSourceOfFollowups.data = this.meetingAgendaFollowups;
        this.dataSourceOfFollowups.sort = this.sortOfFollowups;
        this.sortOfFollowups.sortChange.emit(({active: 'serialNo', direction: 'asc'}) as Sort);
        this.snackBar.open(success_message.DELETED_SUCCESSFULLY)._dismissAfter(3000);
      },
      error1 => {
      },
      () => {
        this.loadingEvent.emit(false);
      });
  }

  openConfirmationDialog(valueString, element): any {
    let MSG;
    MSG = valueString === 'note' ? 'আপনি কি নিশ্চিত ' + '<b>' + this.getAgendaName(element.agendaOid) + '</b> বিষ​য়ের​ এবং <b>' +
      this.getEmployeeName(element.speaker)
      + '</b>এর​ ' + '<b>' + element.note + '</b>টি মুছে ফেলতে চান?' :
      'আপনি কি নিশ্চিত ' + '<b>' + this.getAgendaName(element.agendaOid) +
      '</b> বিষ​য়ের​ ' + '<b>আলোচনা ও সিদ্ধান্ত​</b>টি মুছে ফেলতে চান?';
    const confirmationDialogComponent = this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: valueString, message: MSG}
    });

    confirmationDialogComponent.afterClosed().subscribe(response => {
      if (response === true) {
        valueString === 'note' ? this.deleteNote(element) : this.deleteAgendaFollowup(element.serialNo);
      }
    });
  }

  getAgendaName(agendaOid: string): string {
    if (this.agendas === undefined) {
      return '';
    }
    const agendaObject = this.agendas.filter(agenda => agenda.oid === agendaOid)[0];
    if (agendaObject === undefined) {
      return '';
    }
    return agendaObject.agenda;
  }

  getEmployeeName(empId: string): string {
    const employeeObject = this.invitees.filter(invitee => invitee.memberOid === empId)[0];
    if (employeeObject === undefined) {
      return 'N/A';
    }
    return employeeObject.employee.name;
  }

  getAttachmentType(attachment): string {
    if (attachment.attachmentType === attachment_type.GOVERNMENT_ORDER) {
      return 'GO';
    } else if (attachment.attachmentType === attachment_type.WORKING_PAPER) {
      return 'Working File';
    } else if (attachment.attachmentType === attachment_type.RECEIVED_WORKING_PAPER) {
      return 'Received Working Paper';
    } else if (attachment.attachment === attachment_type.FINAL_WORKING_PAPER) {
      return 'Final Working Paper';
    }
  }

  deleteFile(file: MeetingAttachment) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: '', message: warn_message.DELETE_FILE}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadingEvent.emit(true);
        this.meetingAttachmentService.delete(file).subscribe(response => {
            if (response.status !== 200) {
              this.snackBar.open(success_message.DELETE_FILE)._dismissAfter(3000);
              return;
            }
            if (file.attachmentType === attachment_type.BACKGROUND_WORKING_PAPER) {
              const index = this.backgroundFiles.indexOf(file);
              this.backgroundFiles.splice(index, 1);
              this.dataSourceOfBackgroundFiles.data = this.backgroundFiles;
              this.dataSourceOfBackgroundFiles.sort = this.sortOfBackgroundFiles;
            } else if (file.attachmentType === attachment_type.WORKING_PAPER
              || file.attachmentType === attachment_type.GOVERNMENT_ORDER) {
              const index = this.attachmentFiles.indexOf(file);
              this.attachmentFiles.splice(index, 1);
              this.dataSourceOfAttachmentFiles.data = this.attachmentFiles;
              this.dataSourceOfAttachmentFiles.sort = this.sortOfAttachmentFiles;
            } else if (file.attachmentType === attachment_type.FINAL_WORKING_PAPER) {
              const index = this.receivedWorkingPapers.indexOf(file);
              this.finalWorkingPapers.splice(index, 1);
              this.dataSourceOfFinalWorkingPaper.data = this.finalWorkingPapers;
              this.dataSourceOfFinalWorkingPaper.sort = this.sortOfFinalWorkingPaper;
            } else if (file.attachmentType === attachment_type.RECEIVED_WORKING_PAPER) {
              const index = this.receivedWorkingPapers.indexOf(file);
              this.receivedWorkingPapers.splice(index, 1);
              this.dataSourceOfWorkingPapers.data = this.receivedWorkingPapers;
              this.dataSourceOfWorkingPapers.sort = this.sortOfWorkingPapers;
            } else if (file.attachmentType === attachment_type.NOTICE) {
              const index = this.notices.indexOf(file);
              this.notices.splice(index, 1);
              this.meetingService.setDetailsTabIndex(3);
              location.reload();
            } else if (file.attachmentType === attachment_type.RESOLUTION) {
              const index = this.resolutions.indexOf(file);
              this.resolutions.splice(index, 1);
              this.meetingService.setDetailsTabIndex(3);
              location.reload();
              this.dataSourceOfResolution.data = this.resolutions;
              this.dataSourceOfResolution.sort = this.sortOfResolution;
            }
            this.snackBar.open(success_message.DELETED_SUCCESSFULLY)._dismissAfter(3000);
          },
          error1 => {
          },
          () => {
            this.loadingEvent.emit(false);
          });
      }
    });
  }

  dropFollowupTable(event: CdkDragDrop<MatTableDataSource<MeetingAgendaFollowup>>) {
    const prevIndex = this.dataSourceOfFollowups.data.findIndex((d) => d === event.item.data);
    if (prevIndex === event.currentIndex) {
      return;
    }
    this.loadingEvent.emit(true);
    this.meetingAgendaFollowupsService.updateSerial(event.item.data.oid, event.item.data.agendaOid, this.meetingOid, prevIndex + 1,
      event.currentIndex + 1).subscribe(response => {
        if (response.status !== 200) {
          this.snackBar.open(error_message.UPDATE_FAILED)._dismissAfter(3000);
          return;
        }
        this.snackBar.open(success_message.UPDATED_SUCCESSFULLY)._dismissAfter(3000);
        this.meetingAgendaFollowups = response.data;
        this.dataSourceOfFollowups.data = response.data;
      },
      error1 => {
      },
      () => {
        this.loadingEvent.emit(false);
      });
  }

  viewFile(file: MeetingAttachment) {
    const fileObject = {oid: file.fileOid};
    this.loadingEvent.emit(true);
    this.cmnFileService.downloadFile(fileObject).subscribe(data => {
        const newFile = new File([data], file.fileTitle);
        this.dialog.open(PdfViewerModalComponent, {
          width: '75%',
          height: 'auto',
          data: {oid: file.meetingOid, value: 'file', file: newFile, generate: false}
        });
      },
      error1 => {
      },
      () => {
        this.loadingEvent.emit(false);
      });
  }

  hasPermission(actionTag: string) {
    return this.permissionMap.hasOwnProperty(actionTag) && this.permissionMap[actionTag];
  }

  getComments() {
    const noticeInfo = new NoticeForwardingInfo();
    noticeInfo.meetingOid = this.meetingOid;
    this.loadingEvent.emit(true);
    this.noticeForwardingInfoService.search(noticeInfo).subscribe(x => {
        if (x.status !== 200) {
          this.snackBar.open(warn_message.NOTICE_RESOLUTION_COMMENTS)._dismissAfter(3000);
          return;
        }
        this.noticeForwardingInfos = x.data.content;
        if (this.noticeForwardingInfos.length > 0) {
          this.currentNoticeComment =
            this.noticeForwardingInfos[0].comment ? this.noticeForwardingInfos[0].comment : ' - ';
          this.noticeForwardingInfos.splice(0, 1);
          this.noticeForwardingInfos = this.noticeForwardingInfos
            .filter(inf => inf.comment);
        }
      },
      error1 => {
      },
      () => {
        this.loadingEvent.emit(false);
      });
    const resolutionInfo = new ResolutionApproval();
    resolutionInfo.meetingOid = this.meetingOid;
    this.loadingEvent.emit(true);
    this.resolutionApprovalService.search(resolutionInfo).subscribe(x => {
        if (x.status !== 200) {
          this.snackBar.open(warn_message.NOTICE_RESOLUTION_COMMENTS)._dismissAfter(3000);
          return;
        }
        this.resolutionForwardingInfos = x.data.content;
        if (this.resolutionForwardingInfos.length > 0) {
          this.currentResolutionComment =
            this.resolutionForwardingInfos[0].comment ? this.resolutionForwardingInfos[0].comment : ' - ';
          this.resolutionForwardingInfos.splice(0, 1);
          this.resolutionForwardingInfos = this.resolutionForwardingInfos
            .filter(inf => inf.comment);
        }
      },
      error1 => {
      },
      () => {
        this.loadingEvent.emit(false);
      });
  }
}


