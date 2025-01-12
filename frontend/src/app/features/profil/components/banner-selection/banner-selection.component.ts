import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/utils/modal.service';

@Component({
  selector: 'app-banner-selection',
  templateUrl: './banner-selection.component.html',
  styleUrls: ['./banner-selection.component.scss']
})
export class BannerSelectionComponent implements OnInit {

  @Input() banners: string[] = [];
  @Input() onClose!: (data?: string) => void; // Callback de fermeture
  @Input() selectedBanner: string = '';

  constructor(
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    // this.selectedBanner = this.getRandomBanner();
    if (this.banners.length === 0) {
      console.error('Aucune bannière reçue dans le modal.');
    } else {
      console.log('Bannières reçues dans le modal :', this.banners);
    }
  }

  /**
   * Sélectionne une bannière et ferme le modal en renvoyant la valeur sélectionnée.
   * @param banner La bannière sélectionnée.
   */
  selectBanner(banner: string): void {
    this.selectedBanner = banner;

    // Appelle le callback pour transmettre la bannière sélectionnée
    if (this.onClose) {
      this.onClose(banner);
    }

    // Anim selection banniere
    
    // Ferme le modal
    setTimeout(() => {
      this.modalService.close();  
    }, 500);
  }
}
