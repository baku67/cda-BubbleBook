import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  private isVideoLoaded$ = new BehaviorSubject<boolean>(false); // ✅ Par défaut, la vidéo n'est pas chargée

  get videoLoaded$() {
    return this.isVideoLoaded$.asObservable();
  }

  setVideoLoaded(loaded: boolean) {
    // console.log("🚀 [LandingPageService] Vidéo chargée :", loaded);
    this.isVideoLoaded$.next(loaded);
  }
}
