import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // important pour les styles !
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  constructor(private translate: TranslateService) { }

  // NOTYF npm package
  private notyf = new Notyf({
    duration: 4000,
    ripple: true,
    dismissible: true,
    position: { x: 'right', y: 'bottom' },
    types: [
      {
        type: 'success',
        background: '#4caf50',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'check_circle'
        }
      },
      {
        type: 'error',
        background: '#f44336',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'error_outline'
        }
      },
      {
        type: 'info',
        background: '#2196f3',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'info'
        }
      }
    ]
  });

  success(key: string, params?: any) {
    const translated = this.translate.instant(key, params);
    this.notyf.success(translated);
  }
  
  error(key: string, params?: any) {
    const translated = this.translate.instant(key, params);
    this.notyf.error(translated);
  }
  
  info(key: string, params?: any) {
    const translated = this.translate.instant(key, params);
    this.notyf.open({ type: 'info', message: translated });
  }
}
