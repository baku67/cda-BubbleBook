import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Pipe({
  name: 'timeAgo',
  pure: true
})
export class TimeAgoPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}

  transform(value: string): string {
    return this.utilsService.timeAgo(value);
  }
}