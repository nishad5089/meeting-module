import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  totalPendingWorkingPapers: number;
  totalPendingResponses: number;
  totalPendingNoticeApprovals: number;
  totalPendingResolutionApprovals: number;
  selectedIndex: any = 1;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    const index = this.route.snapshot.paramMap.get('index');
    this.selectedIndex = index ? index : 1;
  }

  receivePendingWorkingPapers($event) {
    this.totalPendingWorkingPapers = $event;
  }

  receivePendingResponses($event) {
    this.totalPendingResponses = $event;
  }

  receivePendingNoticeApprovals($event) {
    this.totalPendingNoticeApprovals = $event;
  }

  receivePendingResolutionApprovals($event) {
    this.totalPendingResolutionApprovals = $event;
  }

}
