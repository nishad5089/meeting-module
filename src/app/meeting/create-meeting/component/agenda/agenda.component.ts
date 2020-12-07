import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {MeetingAgenda} from '../../../model/meeting-agenda';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AddAgendaModalComponent} from '../../../../../app/meeting/create-meeting/component/agenda/modal/add/add-agenda.modal';
import {ConfirmationComponent} from '../../../../shared/confirmation/confirmation.component';
import {success_message, warn_message} from '../../../../constant/messages';

@Component({
  selector: 'app-agenda',
  templateUrl: 'agenda.component.html'
})

export class AgendaComponent {

  meetingAgenda: Array<MeetingAgenda> = new Array<MeetingAgenda>();

  dataSource: MatTableDataSource<MeetingAgenda> = new MatTableDataSource();
  displayedColumns: string[] = ['dragDrop', 'serialNo', 'agenda', 'actions'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Output() agendaEvent = new EventEmitter<Array<MeetingAgenda>>();

  constructor(protected dialog: MatDialog,
              protected snackbar: MatSnackBar) {}

  openDialog(agenda?) {
    const dialogRef = this.dialog.open(AddAgendaModalComponent, {
      width: '60%',
      data: agenda ? agenda : new MeetingAgenda()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {

      } else {
        if (agenda === undefined) {
          result.serialNo = this.meetingAgenda.length + 1;
          this.meetingAgenda.push(result);
          this.dataSource = new MatTableDataSource(this.meetingAgenda);
          this.dataSource.sort = this.sort;
          this.agendaEvent.emit(this.meetingAgenda);
        }
      }
    });
  }

  deleteAgenda(serialNo) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: '', message: warn_message.DELETE_AGENDA}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.meetingAgenda.splice(serialNo - 1, 1);
        for (let i = serialNo - 1; i < this.meetingAgenda.length; i++) {
          this.meetingAgenda[i].serialNo--;
        }

        this.dataSource = new MatTableDataSource(this.meetingAgenda);
        this.agendaEvent.emit(this.meetingAgenda);
      }
    });
  }

  dropAgendaTable(event: CdkDragDrop<MatTableDataSource<MeetingAgenda>, any>) {
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    if (prevIndex === event.currentIndex) {
      return;
    }
    this.dataSource.data.forEach(agendaFollowup => {
      if (prevIndex < event.currentIndex) {
        if ((agendaFollowup.serialNo - 1 > prevIndex) && (agendaFollowup.serialNo - 1 <= event.currentIndex)) {
          agendaFollowup.serialNo--;
        }
      } else {
        if ((agendaFollowup.serialNo - 1 >= event.currentIndex) && (agendaFollowup.serialNo - 1 < prevIndex)) {
          agendaFollowup.serialNo++;
        }
      }
    });
    this.dataSource.data[prevIndex].serialNo = event.currentIndex + 1;
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
    this.dataSource.sort.sortChange.emit({active: 'serialNo', direction: 'asc'});
    this.snackbar.open(success_message.UPDATED_SUCCESSFULLY)._dismissAfter(3000);
  }
}
