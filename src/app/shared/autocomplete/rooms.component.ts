import {Component, Input} from '@angular/core';
import {AutocompleteComponent} from '../../../app/shared/autocomplete/autocomplete.component';
import {MeetingRoom} from '../../../app/meeting/master-settings/meeting-room/model/meeting-room';
import {MeetingRoomService} from '../../../app/meeting/master-settings/meeting-room/service/meeting-room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './autocomplete.component.html'
})
export class RoomsComponent extends AutocompleteComponent<MeetingRoom> {

  @Input() isRequired: boolean;

  constructor(protected service: MeetingRoomService) {
    super(service, 'মিটিং রুম', 'মিটিং রুম বাছাই করুন', new MeetingRoom());
  }

  getOptionLabel(dto: MeetingRoom): string {
    return dto ? dto.roomName + ' (ধারণক্ষমতাঃ ' + (dto.roomCapacity ? dto.roomCapacity : 'N/A') + ')' : '';
  }

}
