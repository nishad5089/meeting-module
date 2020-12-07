import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberManagementService {

  private employeesOidSource = new BehaviorSubject([]);
  employeesOid = this.employeesOidSource.asObservable();

  private guestsOidSource = new BehaviorSubject([]);
  guestsOid = this.guestsOidSource.asObservable();

  private tokenSource = new BehaviorSubject('');
  token = this.tokenSource.asObservable(); // 'group-members' or 'invitees'

  private groupOrMeetingOidSource = new BehaviorSubject('');
  sourceOid = this.groupOrMeetingOidSource.asObservable(); // 'group-members' or 'invitees'

  setEmployeesOid(employeesOid: Array<string>) {
    this.employeesOidSource.next(employeesOid);
  }

  setGuestsOid(guestsOid: Array<string>) {
    this.guestsOidSource.next(guestsOid);
  }

  setToken(token: string) {
    this.tokenSource.next(token);
  }

  setSourceOid(sourceOid: string) {
    this.groupOrMeetingOidSource.next(sourceOid);
  }

}
