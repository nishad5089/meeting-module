import {Component, Input} from '@angular/core';
import {MeetingAgenda} from '../../../app/meeting/model/meeting-agenda';
import {StaticAutocompleteComponent} from '../../../app/shared/autocomplete/static-autocomplete.component';

@Component({
  selector: 'app-meeting-agenda',
  templateUrl: './autocomplete.component.html'
})
export class MeetingAgendaComponent extends StaticAutocompleteComponent<MeetingAgenda> {

  @Input() isRequired: boolean;

  constructor() {
    super('আলোচ্য বিষয়', 'আলোচ্য বিষয় বাছাই করুন');
  }

  getOptionLabel(dto: MeetingAgenda): string {
    return dto ? dto.agenda : '';
  }

  autocomplete(value: string): Array<MeetingAgenda> {
    return this.options.filter(x => x.agenda.includes(value));
  }

}
