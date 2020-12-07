import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MeetingDetails} from '../../../model/meeting-details';
import {MeetingAttachment} from '../../../model/meeting-attachment';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {MeetingDetailsService} from '../../../service/meeting-details.service';
import {MeetingService} from '../../../service/meeting.service';
import {MeetingRefererence} from '../../../model/meeting-refererence';

@Component({
  selector: 'app-background-details',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  attachments: Array<MeetingAttachment>;
  dataSource: MatTableDataSource<MeetingAttachment>;
  enothiReference: string;
  meetingBackground: string;
  previousMeetingReferences: Array<MeetingRefererence>;

  @Input() meetingOid: string;
  @Output() backgroundEvent = new EventEmitter<any>();

  displayedColumns: string[] = ['serialNo', 'fileTitle', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private meetingService: MeetingService,
              private meetingDetailsService: MeetingDetailsService) {
    this.previousMeetingReferences = [];
  }

  ngOnInit() {
    const meetingDetails = new MeetingDetails();
    if (this.meetingOid === 'default_oid') {
      return;
    }
    meetingDetails.oid = this.meetingOid;
    this.meetingDetailsService.getBackgroundDetails(meetingDetails).subscribe(response => {
      this.enothiReference = response.data.enothiReference;
      this.meetingBackground = response.data.meetingBackground;
      this.previousMeetingReferences = response.data.previousMeetingReferences;
      this.meetingService
        .getSelected(
          response.data.previousMeetingReferences.map(ref => ref.referenceOid))
        .subscribe(res => {
          this.previousMeetingReferences.forEach(ref => {
            ref.meeting = res.data.filter(x => x.oid === ref.referenceOid)[0];
          });
          this.backgroundEvent.emit(response.data);
        });
    });
  }

  getUrl() {
    let url = window.location.href;
    url = url.substr(0, url.lastIndexOf('\/'));
    return url;
  }
}
