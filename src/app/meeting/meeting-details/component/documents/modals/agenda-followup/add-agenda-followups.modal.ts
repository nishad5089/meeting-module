import {Component, Inject, ViewChild} from '@angular/core';
import {MeetingAgenda} from '../../../../../model/meeting-agenda';
import {MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {MeetingAgendaFollowup} from '../../../../../model/meeting-agenda-followup';
import {MeetingNote} from '../../../../../model/meeting-note';
import {MeetingInvitee} from '../../../../../model/meeting-invitee';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-agenda-followup',
  templateUrl: './add-agenda-followups.modal.html',
})

export class AgendaFollowupDialogComponent {

  agendaForEdit: MeetingAgenda;
  copyAgendaFollowup: MeetingAgendaFollowup;
  relatedNotes: MatTableDataSource<MeetingNote>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<AgendaFollowupDialogComponent>,
    protected snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {agendaFollowup: MeetingAgendaFollowup, notes: Array<MeetingNote>,
      invitees: Array<MeetingInvitee>, agendas: Array<MeetingAgenda>}
    ) {
    this.copyAgendaFollowup = _.cloneDeep(this.data.agendaFollowup);
    this.relatedNotes = new MatTableDataSource();
    if (!this.copyAgendaFollowup.oid) {
      this.copyAgendaFollowup.discussion = '';
      this.copyAgendaFollowup.decision = '';
      this.copyAgendaFollowup.responsibleEntity = '';
    } else {
      const agendas: Array<MeetingAgenda> = this.data.agendas;
      this.agendaForEdit = new MeetingAgenda();
      this.agendaForEdit.oid = this.copyAgendaFollowup.agendaOid;
      this.agendaForEdit.agenda = agendas.filter(agenda => agenda.oid === this.agendaForEdit.oid)[0].agenda;
      this.getRelatedNotes(this.copyAgendaFollowup.agendaOid);
    }
  }

  saveAgendaFollowup() {
    if ( this.copyAgendaFollowup.agendaOid === undefined) {
      this.snackbar.open('দয়া করে একটি আলোচ্য বিষয় বাছাই করুন')._dismissAfter(3000);
      return;
    }
    if (this.copyAgendaFollowup.discussion === undefined
      || this.copyAgendaFollowup.discussion.trim().length === 0) {
      this.snackbar.open('দয়া করে একটি যথার্থ আলোচনা লিখুন')._dismissAfter(3000);
      return;
    }
    if (_.isEqual(this.copyAgendaFollowup, this.data.agendaFollowup) === true) {
      this.closeModal();
      return;
    }
    this.copyAgendaFollowup.oldAgendaFollowup = _.cloneDeep(this.data.agendaFollowup);
    this.dialogRef.close(this.copyAgendaFollowup);
  }

  closeModal() {
    this.dialogRef.close();
  }

  setAgenda(agenda: MeetingAgenda) {
    if (agenda === null ) {
      this.copyAgendaFollowup.agendaOid = undefined;
      return;
    }
    this.copyAgendaFollowup.agendaOid = agenda.oid;
    this.getRelatedNotes(this.copyAgendaFollowup.agendaOid);
  }

  getRelatedNotes(agendaOid: string) {
    const notes = this.data.notes.filter(note => note.agendaOid === agendaOid);
    this.relatedNotes = new MatTableDataSource(notes);
    this.relatedNotes.paginator = this.paginator;
  }

  getEmployeeName(empId: string): string {
    const employeeObject = this.data.invitees.filter(invitee => invitee.memberOid === empId)[0];
    if (employeeObject === undefined) {
      return 'N/A';
    }
    return employeeObject.employee.name;
  }

  addDiscussion(name: string, note: string) {
    this.copyAgendaFollowup.discussion += name + ': ' + note + '\n';
  }

  getTitle() {
    return this.data.agendaFollowup.oid === undefined ? ' আলোচনা ও সিদ্ধান্ত​ যুক্তকরণ ' : ' আলোচনা ও সিদ্ধান্ত​ সম্পাদন​করণ ';
  }
}
