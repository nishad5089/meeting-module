import {MasterTodos} from './master-todos';

export class Response extends MasterTodos {
  invitationOid: string;
  nominationStatus: string;
  attendeeResponseStatus: string;
  nominationCapabilityStatus: string;
  ownershipStatus: string;
}
