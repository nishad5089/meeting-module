import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memTranslate'
})
export class MemTranslatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value === undefined ? '' : value.toLowerCase();
  }

}
