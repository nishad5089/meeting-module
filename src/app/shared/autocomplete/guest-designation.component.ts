import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AutocompleteComponent} from './autocomplete.component';
import {Settings} from '../../meeting/guests/settings/model/settings';
import {SettingsService} from '../../meeting/guests/settings/service/settings.service';
import {guest_settings} from '../../constant/settings-type';
import {GuestAutocompleteComponent} from './guest-autocomplete.component';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-guest-designation',
  templateUrl: './autocomplete.component.html'
})

export class GuestDesignationComponent extends GuestAutocompleteComponent<Settings> implements OnChanges {

  @Input() isRequired: boolean;

  constructor(protected service: SettingsService) {
    super(service, 'পদবী', 'পদবী বাছাই করুন', new Settings(guest_settings.designation));
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
