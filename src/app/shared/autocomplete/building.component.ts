import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AutocompleteComponent} from '../../../app/shared/autocomplete/autocomplete.component';
import {Building} from '../../meeting/master-settings/building/model/building';
import {BuildingService} from '../../meeting/master-settings/building/service/building.service';

@Component({
  selector: 'app-building',
  templateUrl: './autocomplete.component.html'
})
export class BuildingComponent extends AutocompleteComponent<Building> implements OnChanges {

  @Input() isRequired: boolean;
  @Input() reset: boolean;

  constructor(protected service: BuildingService) {
    super(service, 'ভবনের নাম', 'ভবনের নাম​ বাছাই করুন', new Building());
  }

  getOptionLabel(dto: Building): string {
    return dto ? dto.buildingName : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['reset'] && changes['reset'].currentValue) {
      this.fcAutocomplete.setValue('');
      this.changed.emit(null);
    }
  }

}
