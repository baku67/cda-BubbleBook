import { Component } from '@angular/core';
import { AnimationService } from '../../shared/services/utils/animation.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent {
  
  isAnimatingFadeOut = false;

  constructor(private animationService: AnimationService) { }

}
