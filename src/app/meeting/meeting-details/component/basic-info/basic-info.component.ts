import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MeetingDetails} from '../../../model/meeting-details';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {MeetingAgenda} from '../../../model/meeting-agenda';
import {MeetingAgendaService} from '../../service/meeting-agenda.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MasterComponent} from '../../../core/master.component';
import {MeetingService} from '../../../service/meeting.service';
import {MeetingDetailsService} from '../../../service/meeting-details.service';
import {ConfirmationComponent} from '../../../../shared/confirmation/confirmation.component';
import {ActionService} from '../../../master-settings/acl/action/service/action.service';
import {displayChairpersonClass, displayNoChairpersonClass} from '../../../../constant/custom-class';
import {error_message, success_message, warn_message} from '../../../../constant/messages';
import * as _ from 'lodash';



@Component({
  selector: 'app-basic-info-details',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})

export class BasicInfoComponent extends MasterComponent<MeetingAgenda> implements OnInit {

  meetingDetails: MeetingDetails;
  @Output() indexEvent = new EventEmitter<number>();
  @Output() basicInfoEvent = new EventEmitter<any>();
  @Output() loadingEvent = new EventEmitter<boolean>();
  @Input() meetingOid: string;
  @Input() permissionMap: Map<string, boolean>;

  dataSource: MatTableDataSource<MeetingAgenda>;
  agendas: Array<MeetingAgenda>;
  displayedColumns: string[] = ['dragDrop', 'serialNo', 'agenda', 'actions'];
  displayClass: string;
  @ViewChild('agendaSort', {static: true}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private meetingService: MeetingService,
    private meetingDetailsService: MeetingDetailsService,
    protected meetingAgendaService: MeetingAgendaService,
    protected snackbar: MatSnackBar) {
    super(meetingAgendaService, dialog, snackbar);
    this.agendas = new Array<MeetingAgenda>();
    this.dataSource = new MatTableDataSource(this.agendas);
    this.meetingDetails = new MeetingDetails();
  }

  ngOnInit() {
    const details = new MeetingDetails();
    details.oid = this.meetingOid;
    this.meetingDetailsService.getBasicMeetingDetails(details).subscribe(response => {
      if (response.status !== 200) {
        return;
      }
      // console.log(response.data);
      this.basicInfoEvent.emit(response.data);
      this.dataSource.data = response.data.agendas;
      this.dataSource.sort = this.sort;
      // this.sort.sortChange.emit(({active: 'serialNo', direction: 'asc'}) as Sort);

      this.meetingDetails = response.data;
      if (this.meetingDetails.chairperson && this.meetingDetails.chairperson.employee) {
        this.displayClass = displayChairpersonClass;
      } else {
        this.displayClass = displayNoChairpersonClass;
      }
    },
      error1 => {},
      () => {
      });
  }

  hasPermission(actionTag: string) {
    return this.permissionMap.hasOwnProperty(actionTag) && this.permissionMap[actionTag];
  }

  getAgendaAddTag(): string {
    return ActionService.ACTION_AGENDA_ADD;
  }

  getAgendaEditTag(): string {
    return ActionService.ACTION_AGENDA_EDIT;
  }

  getAgendaDeleteTag(): string {
    return ActionService.ACTION_AGENDA_DELETE;
  }

  openDialog(agenda?: MeetingAgenda) {
    this.dialog.open(BasicInfoDialogComponent, {
      width: '60%',
      data: agenda ? agenda : new MeetingAgenda()
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {

      } else {
        if (agenda === undefined) {
          result.meetingOid = this.meetingOid;
          result.serialNo = this.meetingDetails.agendas.length + 1;
          this.loadingEvent.emit(true);
          this.meetingAgendaService.create(result).subscribe(response => {
              if (response.status !== 200) {
                this.snackbar.open(response.errors)._dismissAfter(3000);
                return;
              }
              this.meetingDetails.agendas.push(response.data);
              this.dataSource.data = this.meetingDetails.agendas;
              this.dataSource.sort = this.sort;
              this.sort.sortChange.emit(({active: 'serialNo', direction: 'asc'}) as Sort);
              this.snackbar.open(success_message.CREATED_SUCCESSFULLY)._dismissAfter(3000);
              this.indexEvent.emit(1);
            },
            error1 => {},
            () => {
              this.loadingEvent.emit(false);
            });
        } else {
          this.loadingEvent.emit(true);
          this.meetingAgendaService.update(result).subscribe(response => {
            if (response.status !== 200) {
              this.snackbar.open(response.errors)._dismissAfter(3000);
              return;
            }
            this.dataSource.data = this.meetingDetails.agendas;
            this.dataSource.sort = this.sort;
            this.sort.sortChange.emit(({active: 'serialNo', direction: 'asc'}) as Sort);
            this.snackbar.open(success_message.UPDATED_SUCCESSFULLY)._dismissAfter(3000);
            this.indexEvent.emit(1);
          },
            error1 => {},
            () => {
              this.loadingEvent.emit(false);
            });
        }
      }
    });
  }

  deleteAgenda(row: MeetingAgenda) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: '', message: 'আপনি কি <b>' + 'আলোচ্য বিষয়' + '</b> টি মুছে ফেলতে চান​?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadingEvent.emit(true);
        this.meetingAgendaService.delete(row).subscribe(response => {
          if (response.status !== 200) {
            this.snackbar.open(response.errors)._dismissAfter(3000);
            return;
          }
          this.meetingDetails.agendas.splice(row.serialNo - 1, 1);
          for (let i = row.serialNo - 1; i < this.meetingDetails.agendas.length; i++) {
            this.meetingDetails.agendas[i].serialNo--;
          }
          this.dataSource.data = this.meetingDetails.agendas;
          this.dataSource.sort = this.sort;
          this.sort.sortChange.emit(({active: 'serialNo', direction: 'asc'}) as Sort);
          this.snackbar.open(success_message.DELETED_SUCCESSFULLY)._dismissAfter(3000);
          this.indexEvent.emit(1);
        },
          error1 => {},
          () => {
            this.loadingEvent.emit(false);
          });
      }
    });
  }

  dropTable(event: CdkDragDrop<MatTableDataSource<MeetingAgenda>>) {
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    if (prevIndex === event.currentIndex) {
      return;
    }
    this.loadingEvent.emit(true);
    this.meetingAgendaService.updateSerial(event.item.data.oid, event.item.data.meetingOid, prevIndex + 1,
      event.currentIndex + 1).subscribe(response => {
      this.showSnackbar(response.status !== 200 ?
        error_message.UPDATE_FAILED
        : success_message.UPDATED_SUCCESSFULLY);
      this.meetingDetails.agendas = response.data;
      this.dataSource.data = response.data;
    },
      error1 => {},
      () => {
        this.loadingEvent.emit(false);
      });
  }
}


@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.modal.html',
  styleUrls: ['./basic-info.component.css']
})

export class BasicInfoDialogComponent {
  str: string;
  oldAgenda: MeetingAgenda;

  constructor(
    public dialogRef: MatDialogRef<BasicInfoDialogComponent>,
    protected snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: MeetingAgenda) {
    if (this.data.oid) {
      this.oldAgenda = _.cloneDeep(this.data);
    }
    this.str = this.data.agenda;
  }

  closeModal() {
    this.dialogRef.close();
  }

  sendData() {
    if (this.str === undefined
      || this.str.trim().length === 0) {
      this.snackbar.open(warn_message.ADD_AGENDA)._dismissAfter(3000);
      return;
    }

    this.data.agenda = this.str;
    if (this.data.oid) {
      if (_.isEqual(this.oldAgenda, this.data) === true) {
        this.closeModal();
        return;
      }
      this.data.oldAgenda = this.oldAgenda;
    }
    this.dialogRef.close(this.data);
  }
}
