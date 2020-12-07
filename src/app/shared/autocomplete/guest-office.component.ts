import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AutocompleteComponent} from './autocomplete.component';
import {Settings} from '../../meeting/guests/settings/model/settings';
import {SettingsService} from '../../meeting/guests/settings/service/settings.service';
import {guest_settings} from '../../constant/settings-type';
import {GuestAutocompleteComponent} from './guest-autocomplete.component';

@Component({
  selector: 'app-guest-office',
  templateUrl: './autocomplete.component.html'
})

export class GuestOfficeComponent extends GuestAutocompleteComponent<Settings> implements OnChanges {

  @Input() isRequired: boolean;

  constructor(protected service: SettingsService) {
    super(service, 'অফিস', 'অফিস বাছাই করুন', new Settings(guest_settings.office));
  }

  getOptionLabel(dto: Settings): string {
    return dto ? dto.fieldNameBn : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reset'] && changes['reset'].currentValue) {
      this.fcAutocomplete.setValue('');
    }
  }

}
