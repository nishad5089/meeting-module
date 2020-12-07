import {Component} from '@angular/core';
import {AutocompleteWithChips} from './autocomplete-with-chips';
import {Meeting} from '../../meeting/model/meeting';
import {MeetingService} from '../../meeting/service/meeting.service';

@Component({
  selector: 'app-previous-reference',
  templateUrl: 'autocomplete-with-chips.html'
})

export class PreviousReferenceAutocompleteComponent extends AutocompleteWithChips<Meeting> {

  constructor(protected service: MeetingService) {
    super(service, 'পূর্ববর্তী মিটিং সূত্র', 'পূর্ববর্তী মিটিং সূত্র লিখুন​', new Meeting());
  }

  getOptionLabel(dto: Meeting): string {
    return dto.meetingTitle;
  }

}
