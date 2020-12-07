import {Component, EventEmitter, Input, Output} from '@angular/core';

import {speedDialFabAnimations} from './speed-dial-fab.animation';

export interface FabButton {
  icon: string;
  tooltip: string;
  show: boolean;
}

export enum SpeedDialFabPosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right'
}

@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent {

  @Input('reverse-column-direction') reverseColumnDirection = false;
  @Input('buttons') fabButtons: FabButton[];
  @Output('fabClick') fabClick = new EventEmitter();

  buttons = [];
  fabTogglerState = 'inactive';

  constructor() {
  }

  private showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  private hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  public onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  public onClickFab(btn: { icon: string, tooltip: string }) {
    this.hideItems();
    this.fabClick.emit(btn);
  }
}
