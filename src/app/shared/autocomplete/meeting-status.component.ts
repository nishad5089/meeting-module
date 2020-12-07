import {Component, Input} from '@angular/core';
import {StaticAutocompleteComponent} from '../../../app/shared/autocomplete/static-autocomplete.component';

@Component({
  selector: 'app-meeting-status',
  templateUrl: './autocomplete.component.html'
})
export class MeetingStatusComponent extends StaticAutocompleteComponent<any> {

  @Input() isRequired: boolean;

  constructor() {
    super('অবস্থা', 'অবস্থা বাছাই করুন');
  }

  getOptionLabel(dto: any): string {
    return dto ? dto.label : '';
  }

  autocomplete(value: string): Array<any> {
    return this.options.filter(x => x.label.includes(value));
  }

}
