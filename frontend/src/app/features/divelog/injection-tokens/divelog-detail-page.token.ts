// divelog-detail-page.tokens.ts
import { InjectionToken } from '@angular/core';
import { DivelogDetailPageComponent } from '../components/divelog-detail-page/divelog-detail-page.component';

export const DIVELOG_DETAIL_PAGE = new InjectionToken<DivelogDetailPageComponent>(
  'DIVELOG_DETAIL_PAGE'
);
