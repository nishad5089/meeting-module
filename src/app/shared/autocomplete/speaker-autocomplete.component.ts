import {Component, Input} from '@angular/core';
import {StaticAutocompleteComponent} from '../../../app/shared/autocomplete/static-autocomplete.component';
import {MeetingInvitee} from '../../meeting/model/meeting-invitee';

@Component({
  selector: 'app-speaker',
  templateUrl: './autocomplete.component.html'
})
export class SpeakerAutocompleteComponent extends StaticAutocompleteComponent<MeetingInvitee> {

  @Input() isRequired: boolean;

  constructor() {
    super('বক্তা', 'বক্তা বাছাই করুন');
  }

  getOptionLabel(dto: MeetingInvitee): string {
    let text = '';
    if (dto && dto.employee) {
      if (dto.employee.name) {
        text += dto.employee.name;
      }
      if (dto.employee.designationName) {
        if (text) {
          text += ', ' + dto.employee.designationName;
        } else {
          text += dto.employee.designationName;
        }
      }
      if (dto.employee.orgName) {
        if (text) {
          text += ', ' + dto.employee.orgName;
        } else {
          text += dto.employee.orgName;
        }
      }
    }
    return text;
  }

  autocomplete(value: string): Array<MeetingInvitee> {
    return this.options
      .filter(x => x.employee
      && (x.employee.name && x.employee.name.includes(value))
      || (x.employee.orgName && x.employee.orgName.includes(value))
      || (x.employee.designationName && x.employee.designationName.includes(value))
      || (x.employee.departmentName && x.employee.departmentName.includes(value))
      || (x.employee.nameEn && x.employee.nameEn.includes(value)));
  }

}
