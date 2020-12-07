import {ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MasterService} from 'app/meeting/core/master.service';
import {MasterModel} from 'app/meeting/core/master.model';
import {Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';

export abstract class AutocompleteWithChips<T extends MasterModel> implements OnInit {

  data: Observable<Array<T>>;
  fcAutocomplete = new FormControl();

  @Input() selectedValue: T[];
  @Output() changed: EventEmitter<T[]> = new EventEmitter<T[]>();
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chips: T[] = [];

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(protected service: MasterService<T>,
              public label: string,
              public placeholder: string,
              protected dto: T) {
  }

  abstract getOptionLabel(dto: T): string;

  ngOnInit() {
    if (this.selectedValue) {
      this.chips = this.selectedValue;
    }
    this.data = this.fcAutocomplete.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'object') {
          this.changed.emit(value);
          return of(null);
        }
        return this.autocomplete(value);
      })
    );
  }

  protected autocomplete(value: string = ''): Observable<Array<T>> {
    this.dto.setAutocomplete(value);
    return this.service.search(this.dto)
      .pipe(map(response => response.data.content
        .filter(res => !this.chips.map(x => x.oid).includes(res.oid))));
  }

  setValue(dto: T) {
    return dto;
  }

  remove(fruit: T): void {
    const index = this.chips.indexOf(fruit);

    if (index >= 0) {
      this.chips.splice(index, 1);
      this.changed.emit(this.chips);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chips.push(event.option.value);
    this.changed.emit(this.chips);
    this.fruitInput.nativeElement.value = '';
    this.fcAutocomplete.setValue('');
  }

}
