// viewport.service.ts
import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobile$(): Observable<boolean> {
    return this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }

  isTablet$(): Observable<boolean> {
    return this.breakpointObserver.observe([Breakpoints.Tablet])
      .pipe(map(result => result.matches));
  }

  isMobileOrTablet$(): Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map(result => result.matches));
  }

  isDesktop$(): Observable<boolean> {
    return this.breakpointObserver.observe([
      Breakpoints.Web,
      Breakpoints.WebLandscape
    ]).pipe(map(result => result.matches));
  }
}
