import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ActionLogService} from '../../service/action-log.service';
import {ActionLog} from '../../../model/action-log';
import {error_message, numbers} from '../../../../constant/messages';
import {MatSnackBar} from '@angular/material';
import {meeting_status} from '../../../../constant/meeting-status';
import {MeetingService} from '../../../service/meeting.service';
import {Meeting} from '../../../model/meeting';

@Component({
  selector: 'app-action-log',
  templateUrl: './action-log.component.html',
  styleUrls: ['./action-log.component.css']
})

export class ActionLogComponent implements OnChanges {

  @Output() loadingEvent = new EventEmitter<boolean>();
  @Input() meetingOid: string;
  @Input() selectedIndex: number;
  actionLogs: ActionLog[];
  steps: {label: string, step: number, state: string}[] = [];
  currentStep: number = 0;
  currentStatus = '';
  ERROR_STATES = ['notice_sent_for_correction', 'resolution_sent_for_correction'];

  constructor(protected service: ActionLogService,
              protected meetingService: MeetingService,
              protected snackbar: MatSnackBar) {

  }

  getMeetingLogs() {
    this.loadingEvent.emit(true);
    this.service.search(new ActionLog(this.meetingOid), numbers.INFINITY, 0)
      .subscribe(res => {
        if (res.status !== 200) {
          this.snackbar.open(error_message.ACTION_LOG_FETCH)._dismissAfter(4000);
          return;
        }
        this.actionLogs = res.data.content;
      }, error1 => {
      }, () => {
        this.loadingEvent.emit(false);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('meetingOid')) {
      const meeting = new Meeting();
      meeting.oid = changes['meetingOid'].currentValue;
      this.meetingService.getOne(meeting).subscribe(x => {
        if (x.status !== 200 || !x.data) {
          return;
        }
        this.currentStatus = x.data.meetingStatus;
        this.currentStep = meeting_status.get(this.currentStatus.toUpperCase()).stateNumber;
        if (this.currentStatus === meeting_status.get('MEETING_CANCELLED').tag) {
          return;
        }
        if (this.ERROR_STATES.includes(this.currentStatus)) {
          this.processErrorSteps();
        } else {
          this.processSuccessSteps();
        }
      });
    }
    if (changes['selectedIndex'].currentValue === 4) {
      this.getMeetingLogs();
    }
  }

  processErrorSteps() {
    meeting_status.forEach((v, k) => {
      if (v.stateNumber > 0) {
        if (this.currentStatus === v.tag) {
          this.steps.splice(this.steps.length - 1, 1);
        } else if (this.ERROR_STATES.includes(v.tag)) {
          return;
        }
        const stateVar = v.stateNumber > this.currentStep ? v.stateNumber.toString() : v.state;
        this.steps.push({label: v.stateLabel, step: v.stateNumber, state: stateVar});
      }
    });
  }

  processSuccessSteps() {
    meeting_status.forEach((v, k) => {
      if ((v.stateNumber > 0) && !this.ERROR_STATES.includes(v.tag)) {
        const stateVar = v.stateNumber > this.currentStep ? v.stateNumber.toString() : v.state;
        this.steps.push({label: v.stateLabel, step: v.stateNumber, state: stateVar});
      }
    });
  }

  getIconClass(logType: string): string {
    if (logType.includes('notice_create')) {
      return 'fa fa-file-word-o';
    } else if (logType.includes('invitee_add')) {
      return 'fa fa-user-plus';
    } else if (logType.includes('create')) {
      return 'fa fa-plus-circle';
    } else if (logType.includes('notice_approval_response')) {
      return 'fa fa-reply';
    } else if (logType.includes('resolution_approval_response')) {
      return 'fa fa-reply';
    } else if (logType.includes('delete')) {
      return 'fa fa-minus-circle';
    } else if (logType.includes('edit')) {
      return 'fa fa-edit';
    } else if (logType.includes('meeting_cancel')) {
      return 'fa fa-close';
    } else if (logType.includes('meeting_reschedule')) {
      return 'fa fa-calendar';
    } else if (logType.includes('group_add_in_meeting')) {
      return 'fa fa-users';
    }
  }

  setDetailsClass(log: ActionLog): string {
    return log.details ? 'col-md-1' : 'col-md-2';
  }

  setViewTextClass(log: ActionLog): string {
    return log.details ? 'col-md-10' : 'col-md-11';
  }
}
