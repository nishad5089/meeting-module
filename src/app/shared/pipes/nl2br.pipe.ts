import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br'
})
export class Nl2brPipe implements PipeTransform {

  transform(str: string, ...args: any[]): any {
    if (str === undefined ) {
      return '';
    }
    return str.replace(/\n/g, '<br/>');
  }

}
