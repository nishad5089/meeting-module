import {EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {MasterModel} from '../../../app/meeting/core/master.model';
import {Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
import {startWith, switchMap} from 'rxjs/operators';

export abstract class StaticAutocompleteComponent<T extends MasterModel> implements OnInit, OnChanges {

  data: Observable<Array<T>>;
  fcAutocomplete = new FormControl();

  @Input() options: T[];
  @Input() selectedValue: T;
  @Output() changed: EventEmitter<T> = new EventEmitter<T>();

  constructor(public label: string,
              public placeholder: string) {
  }

  ngOnInit() {
    this.fcAutocomplete.setValue(this.selectedValue);
    this.data = this.fcAutocomplete.valueChanges.pipe(
      startWith(this.getStartValue()),
      switchMap(value => {
        if (typeof value === 'object') {
          this.changed.emit(value);
          return of(null);
        } else if (!value) {
          this.changed.emit(null);
        }
        return of(this.autocomplete(value));
      })
    );
  }

  getStartValue() {
    if (!this.selectedValue) {
      return '';
    }
    return this.selectedValue;
  }

  abstract getOptionLabel(dto: T): string;

  abstract autocomplete(value: string): Array<T>;

  setValue(dto: T) {
    return dto;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const  name: SimpleChange = changes.selectedValue;
    if (!name.currentValue) {
      this.fcAutocomplete.setValue('');
    }
  }

}
