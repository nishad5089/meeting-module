import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'localNumber',
})
export class LocalNumberPipe implements PipeTransform {

    public finalEnlishToBanglaNumber =
      {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
      'a few seconds ago': 'কিছুক্ষণ আগে', 'a minute ago': 'এক মিনিট আগে', 'minutes ago': 'মিনিট আগে', 'an hour ago': 'এক ঘণ্টা আগে',  'hours ago': 'ঘণ্টা আগে',
      'a day ago': 'এক দিন​ আগে', 'days ago': 'দিন​ আগে', 'a month ago': 'এক মাস​ আগে', 'months ago': 'মাস​ আগে', 'a year ago': 'এক বছর​ আগে', 'years ago': 'বছর​ আগে'};

    transform(number: any): string {
      if (!number) {
            return;
      }

      for (const x of Object.keys(this.finalEnlishToBanglaNumber)) {
        number = number.toString().replace(new RegExp(x, 'g'), this.finalEnlishToBanglaNumber[x]);
      }
      return number;
    }
}
