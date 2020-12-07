import {Component, Input} from '@angular/core';
import {AutocompleteComponent} from './autocomplete.component';
import {Settings} from '../../meeting/guests/settings/model/settings';
import {SettingsService} from '../../meeting/guests/settings/service/settings.service';
import {guest_settings} from '../../constant/settings-type';

@Component({
  selector: 'app-guest-organization',
  templateUrl: './autocomplete.component.html'
})

export class GuestOrganizationComponent extends AutocompleteComponent<Settings> {

  @Input() isRequired: boolean;

  constructor(protected service: SettingsService) {
    super(service, 'সংগঠন', 'সংগঠন বাছাই করুন', new Settings(guest_settings.organization));
  }

  getOptionLabel(dto: Settings): string {
    return dto ? dto.fieldNameBn : '';
  }
}
