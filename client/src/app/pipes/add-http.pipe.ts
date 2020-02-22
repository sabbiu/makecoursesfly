import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addHttp',
})
export class AddHttpPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      if (!/^(?:f|ht)tps?\:\/\//.test(value)) {
        value = 'http://' + value;
      }
    }
    return value;
  }
}
