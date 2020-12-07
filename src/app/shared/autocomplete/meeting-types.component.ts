import {Component, Input} from '@angular/core';
import {AutocompleteComponent} from '../../../app/shared/autocomplete/autocomplete.component';
import {MeetingType} from '../../../app/meeting/master-settings/meeting-type/model/meeting-type';
import {MeetingTypeService} from '../../../app/meeting/master-settings/meeting-type/service/meeting-type.service';

@Component({
  selector: 'app-meeting-types',
  templateUrl: './autocomplete.component.html'
})
export class MeetingTypesComponent extends AutocompleteComponent<MeetingType> {

  @Input() isRequired: boolean;

  constructor(protected service: MeetingTypeService) {
    super(service, 'মিটিংয়ের ধরন', 'মিটিংয়ের ধরন​ বাছাই করুন', new MeetingType());
  }

  getOptionLabel(dto: MeetingType): string {
    return dto ? dto.typeName : '';
  }

}
