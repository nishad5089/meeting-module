import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AutocompleteComponent} from '../../../app/shared/autocomplete/autocomplete.component';
import {MeetingFrequency} from '../../meeting/master-settings/meeting-frequency/model/meeting-frequency';
import {MeetingFrequencyService} from '../../meeting/master-settings/meeting-frequency/service/meeting-frequency.service';

@Component({
  selector: 'app-meeting-frequency',
  templateUrl: './autocomplete.component.html'
})
export class MeetingFrequencyComponent extends AutocompleteComponent<MeetingFrequency> implements OnChanges {

  @Input() isRequired: boolean;
  @Input() reset: boolean;

  constructor(protected service: MeetingFrequencyService) {
    super(service, 'পুনরাবৃত্তি', 'পুনরাবৃত্তি​ বাছাই করুন', new MeetingFrequency());
  }

  getOptionLabel(dto: MeetingFrequency): string {
    return dto ? dto.frequency : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['reset'] && changes['reset'].currentValue) {
      this.fcAutocomplete.setValue('');
      this.changed.emit(null);
    }
  }

}
