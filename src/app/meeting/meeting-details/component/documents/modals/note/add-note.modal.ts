import {Component, Inject} from '@angular/core';
import {MeetingAgenda} from '../../../../../model/meeting-agenda';
import {MeetingInvitee} from '../../../../../model/meeting-invitee';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MeetingNote} from '../../../../../model/meeting-note';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as _ from 'lodash';

@Component({
  templateUrl: './add-note.modal.html',
})

export class NoteDialogComponent {

  copyNote: MeetingNote;

  constructor(
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {note: MeetingNote, invitees: Array<MeetingInvitee>, agendas: Array<MeetingAgenda>},
    protected snackbar: MatSnackBar) {
    this.init();
    this.copyNote = _.cloneDeep(this.data.note);
  }

  init() {
    this.data.note.agenda = this.data.agendas.filter(agenda => agenda.oid === this.data.note.agendaOid)[0];
    this.data.note.spreakerEmployee = this.data.invitees
      .filter(inv => inv.memberOid === this.data.note.speaker)[0];
  }

  closeModal() {
    this.dialogRef.close();
  }

  saveNote() {
    if ( this.copyNote.agendaOid === undefined) {
      this.snackbar.open('দয়া করে একটি আলোচ্য বিষয় বাছাই করুন')._dismissAfter(3000);
      return;
    }
    if ( this.copyNote.speaker === undefined) {
      this.snackbar.open('দয়া করে একজন বক্তা বাছাই করুন')._dismissAfter(3000);
      return;
    }
    if (this.copyNote.note === undefined
      || this.copyNote.note.trim().length === 0) {
      this.snackbar.open('দয়া করে নোট লিখুন')._dismissAfter(3000);
      return;
    }

    this.dialogRef.close(this.copyNote);
  }

  getTitle() {
    return this.data.note.oid === undefined ? ' নোট যোগ করুন ' : ' নোট সম্পাদন​ করুন ';
  }

  callbackAgendaSelected(dto: MeetingAgenda) {
    if (dto) {
      this.copyNote.agendaOid = dto.oid;
      this.copyNote.agenda = dto;
    } else {
      this.copyNote.agendaOid = undefined;
      this.copyNote.agenda = undefined;
    }
  }

  callbackEmployeeSelected(dto: MeetingInvitee) {
    if (dto) {
      this.copyNote.speaker = dto.memberOid;
      this.copyNote.spreakerEmployee = dto;
    } else {
      this.copyNote.speaker = undefined;
      this.copyNote.spreakerEmployee = undefined;
    }
  }
}
