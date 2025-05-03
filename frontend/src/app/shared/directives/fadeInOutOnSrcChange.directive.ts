import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges
  } from '@angular/core';
  
  @Directive({ 
    selector: 'img[fadeOnSrcChange]',
    standalone: true 
})
  export class FadeOnSrcChangeDirective implements OnChanges {
    @Input('fadeOnSrcChange') src: string | null = null;
    private initialized = false;
    private pendingSrc: string | null = null;
  
    constructor(
      private el: ElementRef<HTMLImageElement>,
      private renderer: Renderer2
    ) {}
  
    ngOnChanges(changes: SimpleChanges) {
        const newSrc = changes['src']?.currentValue as string | null;
    
        // Ne rien faire si newSrc est null ou vide
        if (!newSrc) {
          return;
        }
    
        const img = this.el.nativeElement;
        if (!this.initialized) {
          // premier chargement
          this.renderer.setAttribute(img, 'src', newSrc);
          this.renderer.addClass(img, 'initial-fade-in');
          img.addEventListener('animationend', () => {
            this.renderer.removeClass(img, 'initial-fade-in');
          }, { once: true });
          this.initialized = true;
        } else {
          // transitions suivantes
          this.doTransition(newSrc);
        }
      }
  
    private doTransition(newSrc: string) {
      const img = this.el.nativeElement;
  
      if (img.classList.contains('fade-out-srcChanged')) {
        this.pendingSrc = newSrc;
        return;
      }
  
      // fade-out
      this.renderer.addClass(img, 'fade-out-srcChanged');
      img.addEventListener('animationend', () => {
        this.renderer.removeClass(img, 'fade-out-srcChanged');
        this.renderer.setAttribute(img, 'src', newSrc);
  
        // fade-in
        this.renderer.addClass(img, 'fade-in-srcChanged');
        img.addEventListener('animationend', () => {
          this.renderer.removeClass(img, 'fade-in-srcChanged');
          if (this.pendingSrc && this.pendingSrc !== newSrc) {
            const next = this.pendingSrc;
            this.pendingSrc = null;
            this.doTransition(next);
          }
        }, { once: true });
      }, { once: true });
    }
  }
  