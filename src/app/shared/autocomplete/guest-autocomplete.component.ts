import {EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MasterService} from '../../../app/meeting/core/master.service';
import {MasterModel} from '../../../app/meeting/core/master.model';
import {Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';

export abstract class GuestAutocompleteComponent<T extends MasterModel> implements OnInit {

  data: Observable<Array<T>>;
  fcAutocomplete = new FormControl();

  @Input() reset: boolean;
  @Input() selectedValue: T;
  @Output() changed: EventEmitter<T> = new EventEmitter<T>();
  @Output() newInputValue: EventEmitter<string> = new EventEmitter<string>();

  constructor(protected service: MasterService<T>,
              public label: string,
              public placeholder: string,
              protected dto: T) {
  }

  ngOnInit() {
    this.fcAutocomplete.setValue(this.selectedValue);
    this.data = this.fcAutocomplete.valueChanges.pipe(
      startWith(this.getStartValue()),
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'object') {
          this.changed.emit(value);
          return of(null);
        }
        this.newInputValue.emit(value);
        return this.autocomplete(value);
      })
    );
  }

  protected autocomplete(value: string = ''): Observable<Array<T>> {
    this.dto.setAutocomplete(value);
    return this.service.search(this.dto).pipe(map(response => response.data.content));
  }

  setValue(dto: T) {
    return dto;
  }

  abstract getOptionLabel(dto: T): string;

  getStartValue() {
    if (!this.selectedValue) {
      return '';
    }
    return this.selectedValue;
  }

}
