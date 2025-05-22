// src/app/shared/privacy-label.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'privacyLabel' })
export class PrivacyLabelPipe implements PipeTransform {
  private readonly labels: Record<string, string> = {
    ALL:          'Public',
    FRIENDS_ONLY: 'Amis',
    NO_ONE:       'Privé',
  };

  transform(value: string): string {
    return this.labels[value] ?? value;
  }
}
