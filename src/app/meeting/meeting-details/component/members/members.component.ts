import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MasterListComponent} from '../../../../../app/meeting/core/master-list.component';
import {MeetingInvitee} from '../../../../../app/meeting/model/meeting-invitee';
import {InviteeService} from '../../../../../app/meeting/meeting-details/service/invitees.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Group} from '../../../../../app/meeting/groups/model/group';
import {MeetingRole} from '../../../../../app/meeting/model/meeting-role';
import {MeetingRoleService} from '../../../../../app/meeting/meeting-details/service/meeting-role.service';
import {MemberManagementComponent} from '../../../../../app/shared/member-management/member-management.component';
import {roles} from '../../../../../app/constant/roles.constant';
import {SelectionModel} from '@angular/cdk/collections';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ConfirmationComponent} from '../../../../../app/shared/confirmation/confirmation.component';
import {RemarksDialogComponent} from '../../../../../app/meeting/meeting-details/component/members/modals/remarks/remarks.component.modal';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatTableDataSource} from '@angular/material/table';
import {GroupService} from '../../../../../app/meeting/groups/service/group.service';
import {MeetingDetailsService} from '../../../../../app/meeting/service/meeting-details.service';
import {MeetingDetails} from '../../../../../app/meeting/model/meeting-details';
import {GroupDialogComponent} from './modals/group-dialog/group-dialog.component';
import {AuthenticationService} from '../../../../../app/shared/security/service/authentication.service';
import {ActionService} from '../../../master-settings/acl/action/service/action.service';
import {error_message, icon_message, info_message, success_message, warn_message} from '../../../../constant/messages';
import {response_status} from '../../../../constant/attendee-status';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class MembersComponent extends MasterListComponent<MeetingInvitee> implements OnInit {

  type_guest = 'guest';
  type_internal = 'internal';
  type_groups = 'groups';

  @Output() inviteesEvent = new EventEmitter<Array<MeetingInvitee>>();
  @Output() loadingEvent = new EventEmitter<boolean>();
  @Input() meetingOid: string;
  @Input() permissionMap: Map<string, boolean>;

  employeesOid: Array<string> = [];
  guestsOid: Array<string> = [];
  memberList: Array<MeetingInvitee> = [];

  roles: Array<MeetingRole> = [];

  isEdit: boolean = true;

  selection = new SelectionModel<MeetingInvitee>(true, []);
  expandedElement: MeetingInvitee | null;

  constructor(protected service: InviteeService,
              protected dialog: MatDialog,
              protected snackbar: MatSnackBar,
              protected meetingRoleService: MeetingRoleService,
              protected groupService: GroupService,
              protected meetingDetailsService: MeetingDetailsService,
              protected authenticationService: AuthenticationService
  ) {
    super(service, dialog, snackbar);
  }

  ngOnInit() {
    this.getMeetingInvitees();
    this.getRoles();
  }

  hasPermission(actionTag: string) {
    return this.permissionMap.hasOwnProperty(actionTag) && this.permissionMap[actionTag];
  }

  getMemberAddTag(): string {
    return ActionService.ACTION_MEMBER_ADD;
  }

  getNonMemberAddTag(): string {
    return ActionService.ACTION_NON_MEMBER_ADD;
  }

  getMemberEditTag(): string {
    return ActionService.ACTION_MEMBER_EDIT;
  }

  getMemberDeleteTag(): string {
    return ActionService.ACTION_MEMBER_DELETE;
  }

  getNotificationTag(): string {
    return ActionService.ACTION_MEETING_NOTICE_CIRCULATE;
  }

  getSaveAsGroupTag(): string {
    return ActionService.ACTION_SAVE_AS_GROUP;
  }

  getRemarksTag(): string {
    return ActionService.ACTION_REMARKS_ADD;
  }

  setColspan(): number {
    let span = this.displayColumns.length;

    if (this.hasPermission(this.getNotificationTag()) === false
      && this.hasPermission(this.getSaveAsGroupTag()) === false) {
      span--;
    }

    if (this.hasPermission(this.getMemberDeleteTag()) === false) {
      span--;
    }

    if (this.hasPermission(this.getMemberEditTag()) === false) {
      span--;
    }
    return  span;
  }

  getMeetingInvitees() {
    const meetingDetails: MeetingDetails = new MeetingDetails();
    meetingDetails.oid = this.meetingOid;

    if (this.dataSource === undefined) {
      this.dataSource = new MatTableDataSource<MeetingInvitee>();
      this.dataSource.sort = this.sort;
    }

    this.meetingDetailsService.getInviteesDetails(meetingDetails).subscribe(response => {
      this.inviteesEvent.emit(response.data.invitees);
      this.memberList = response.data.invitees;
      this.memberList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
      this.inviteesEvent.emit(this.memberList);
      this.dataSource.data = this.memberList;
      this.dataSource.sort = this.sort;
      this.getEmployeesAndGuestsOid(this.memberList);
    },
      error1 => {},
      () => {
      });
  }

  isEmployee(type: string): boolean {
    return this.type_internal === type;
  }

  isGuest(type: string): boolean {
    return this.type_guest === type;
  }


  getEmployeesAndGuestsOid(arr: MeetingInvitee[]) {
    this.employeesOid = arr.filter(x => this.isEmployee(x.inviteeType))
      .map(y => y.memberOid);
    this.guestsOid = arr.filter(x => this.isGuest(x.inviteeType))
      .map(y => y.memberOid);
  }

  getRoles() {
    this.meetingRoleService.search(new MeetingRole()).subscribe(res => {
      if (res.status !== 200) {
        return;
      }
      this.roles = res.data.content;
    });
  }

  openAddMeetingMembersDialog(type?: string) {
    this.dialog.open(MemberManagementComponent, {
      width: '90%',
      data: {
        memberType: '',
        employeesOid: this.employeesOid,
        guestsOid: this.guestsOid,
        groupsOid: [],
        type: type ? type : 'member'
      }
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {
        return;
      }
      this.getMeetingMembers(result, type);
    });
  }

  saveMembers(membersToCreate: Array<MeetingInvitee>) {
    this.loadingEvent.emit(true);
    this.service.createAll(membersToCreate).subscribe(response => {
      if (response.status !== 200) {
        this.snackbar.open(response.errors)._dismissAfter(3000);
        return;
      }
      this.isLoadingResults = true;
      this.showSnackbar(success_message.ADDED_SUCCESSFULLY);
      this.getMeetingInvitees();
    },
      error1 => {},
      () => {
        this.loadingEvent.emit(false);
      });
  }

  getMeetingMembers(result, type) {
    const membersToCreate: Array<MeetingInvitee> = [];
    if (result.memberType === this.type_groups) {
      // ToDo change to get list directly
      this.loadingEvent.emit(true);
      const group: Group = new Group();
      group.meetingOidForLog = this.meetingOid;
      group.groupOidListForMemberAdd = result.groupsOid;
      this.groupService.getSelectedGroupMembers(group).subscribe(res => {
        let totalInviteesSoFar = this.memberList.length;
        res.data.forEach(x => {
          const meetingInvitee = MeetingInvitee.createInvitee(roles.MEM_MEETING_MEMBER,
            ++totalInviteesSoFar,
            x.memberOid);
          meetingInvitee.meetingOid = this.meetingOid;
          meetingInvitee.inviteeType = x.memberType;
          meetingInvitee.isGroupMember = 'yes';
          membersToCreate.push(meetingInvitee);
        });
        this.saveMembers(membersToCreate);
      },
        error1 => {},
        () => {
          this.loadingEvent.emit(false);
        });
    } else {
      this.saveMembers(this.meetingMembersFactory(type, result.memberType,
        result.memberType === this.type_guest ? result.guestsOid : result.employeesOid));
    }
  }

  meetingMembersFactory(role: string, memberType: string, membersOid: Array<string>): Array<MeetingInvitee> {
    let totalInviteesSoFar = this.memberList.length;
    const membersToCreate: Array<MeetingInvitee> = [];
    membersOid.forEach(x => {
      const meetingInvitee = MeetingInvitee.createInvitee(role, ++totalInviteesSoFar, x);
      meetingInvitee.meetingOid = this.meetingOid;
      meetingInvitee.inviteeType = memberType;
      membersToCreate.push(meetingInvitee);
    });
    return membersToCreate;
  }

  toggleButton() {
    this.isEdit = !this.isEdit;
  }

  toggleButtonAndSave() {
    this.toggleButton();
    this.loadingEvent.emit(true);
    this.service.batchUpdate(this.memberList).subscribe(response => {
      if (response.status !== 200) {
        this.snackbar.open(response.errors)._dismissAfter(3000);
        return;
      }
      this.showSnackbar(success_message.UPDATED_SUCCESSFULLY);
    }, err => {
      this.errorHandler(err);
    }, () => {
      this.loadingEvent.emit(false);
    });
  }

  sendNotification() {
    let members = this.memberList;
    let message = 'আপনি কি <b>সকল</b> সদস্যকে নোটিফিকেশন পাঠাতে চান?';
    if (this.selection.selected.length === 0) {
      this.showSnackbar(warn_message.SELECT_THE_MEMBERS);
      return;
    }
    if (this.isAllSelected() === false) {
      members = this.selection.selected;
      message = warn_message.NOTIFY_SELECTED_MEMBERS;
    }
    this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: '', message: message}
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.sendNotificationToMembers(members);
      }
    });
  }

  sendNotificationToMembers(members: MeetingInvitee[]): void {
    this.loadingEvent.emit(true);
    this.service.sendNotification(members).subscribe(response => {
      if (response.status !== 200) {
        this.showSnackbar(response.errors);
        return;
      }
      this.showSnackbar(success_message.NOTIFICATION_SENT_SUCCESSFULLY);
    },
      error1 => {},
      () => {
        this.loadingEvent.emit(false);
      });
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  setToggle(member: MeetingInvitee, field: string) {
    member[field] = member[field] === 'yes' ? 'no' : 'yes';
  }

  getResponseStatus(invitee: MeetingInvitee) {
    if (invitee.attendeeResponseStatus === response_status.PENDING) {
      return {value: icon_message.PENDING, tip: info_message.PENDING};
    } else if (invitee.attendeeResponseStatus === response_status.GOING) {
      return {value: icon_message.GOING, tip: info_message.GOING};
    } else if (invitee.attendeeResponseStatus === response_status.NOT_GOING) {
      return {value: icon_message.NOT_GOING, tip: info_message.NOT_GOING};
    } else {
      return {value: icon_message.NOMINATED, tip: info_message.NOMINATED};
    }
  }

  getMemberRole(invitee: MeetingInvitee): string {
    const roleObject = this.roles.filter(role => role.roleTag === invitee.ownershipStatus)[0];
    if (roleObject === undefined) {
      return;
    }
    return roleObject.roleBn;
  }

  getRemarks(invitee: MeetingInvitee): string {
    return invitee.remarks ? invitee.remarks : '';
  }

  openRemarksDialog(invitee: MeetingInvitee) {
    this.dialog.open(RemarksDialogComponent, {
      width: '60%',
      data: this.getRemarks(invitee)
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === null) {
        return;
      }
      invitee.remarks = result;
      this.loadingEvent.emit(true);
      this.service.update(invitee).subscribe(response => {
        if (response.status !== 200) {
          this.showSnackbar(error_message.COMMENT_COULD_NOT_BE_SAVED_SUCCESSFULLY);
          return;
        }
        this.showSnackbar(success_message.COMMENT_SAVED_SUCCESSFULLY);
      },
        error1 => {},
        () => {
          this.loadingEvent.emit(false);
        });
    });
  }

  dropTable(event: CdkDragDrop<MatTableDataSource<MeetingInvitee>>) {
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    this.loadingEvent.emit(true);
    this.service.updateSerial(event.item.data.oid, this.meetingOid, prevIndex + 1,
      event.currentIndex + 1).subscribe(response => {
        this.showSnackbar(response.status !== 200 ?
        error_message.UPDATE_FAILED
        : success_message.UPDATED_SUCCESSFULLY);
      if (response.status === 200) {
        this.memberList = response.data;
        this.dataSource.data = response.data;
        this.inviteesEvent.emit(this.memberList);
      }
    },
      error1 => {},
      () => {
        this.loadingEvent.emit(false);
      });
  }

  deleteMember(invitee: MeetingInvitee) {
    if (invitee.ownershipStatus === roles.MEM_MEMBER_SECRETARY) {
      this.showSnackbar(warn_message.DELETE_MEMBER_SECRETARY);
      return;
    }
    const initMemberName = invitee.employee.name;
    const memberName = initMemberName === undefined ? 'নির্বাচিত সদস্য ' : initMemberName;
    this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: '', message: 'আপনি কি <b>' + memberName + '</b> কে মিটিং হতে অপসারন করতে চান?'}
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadingEvent.emit(true);
        this.service.delete(invitee).subscribe(response => {
          if (response.status !== 200) {
            this.showSnackbar(response.errors);
            return;
          }
          this.memberList.splice(invitee.serialNo - 1, 1);
          this.memberList.forEach(member => {
            if (member.serialNo > invitee.serialNo) {
              member.serialNo--;
            }
          });
          this.memberList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
          this.inviteesEvent.emit(this.memberList);
          this.dataSource.data = this.memberList;
          this.getMeetingInvitees();
          this.showSnackbar(success_message.DELETED_SUCCESSFULLY);
        },
          error1 => {},
          () => {
            this.loadingEvent.emit(false);
          });
      }
    });
  }

  openGroupDialog() {
    if (this.selection.selected.length === 0) {
      this.showSnackbar(warn_message.CREATE_GROUP);
      return;
    }
    this.dialog.open(GroupDialogComponent, {
      width: '350px',
      data: new Group()
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {
        return;
      }
      result.invitees = this.isAllSelected() ? this.memberList : this.selection.selected;
      result.createdBy = this.authenticationService.currentUserValue.employeeOfficeId;
      this.loadingEvent.emit(true);
      this.groupService.saveAsGroup(result).subscribe(response => {
        if (response.status !== 200) {
          this.showSnackbar(response.errors);
          return;
        }
        if (this.isAllSelected()) {
          this.showSnackbar(this.isAllSelected()
            ? success_message.GROUP_CREATED_WITH_ALL_MEMBERS
            : success_message.GROUP_CREATED_WITH_SELECTED_MEMBERS);
        }
      });
    },
      error1 => {},
      () => {
        this.loadingEvent.emit(false);
      });
  }

  setAddModal() {
  }

  setEditModal() {
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['dragDrop', 'checkBox', 'hierarchy', 'employeeDetails', 'organization',
      'response', 'acknowledgement', 'include', 'signatory', 'workingPaper', 'remarks', 'action'];
    this.addButtonTooltips = info_message.ADD_MEETING_MEMBER;
  }

  hasWorkingPaperRequest(row: any) {
    return row.workingPaperRequirement === 'yes'
      || row.workingPaperRequirement === 'uploaded';
  }

  getMeetingMemberRole(): string {
    return roles.MEM_MEETING_MEMBER;
  }

  getMeetingNonMemberRole(): string {
    return roles.MEM_NON_MEMBER;
  }
}
