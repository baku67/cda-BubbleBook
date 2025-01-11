import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-selection',
  templateUrl: './banner-selection.component.html',
  styleUrls: ['./banner-selection.component.scss']
})
export class BannerSelectionComponent implements OnInit {
  @Input() banners: string[] = [];
  selectedBanner: string = '';

  constructor() {}

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
    // this.dialogRef.close(this.selectedBanner);
  }
}
