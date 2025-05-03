import { Component } from '@angular/core';
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { UserDivelog } from '../../models/UserDivelog.model';
import { DivelogService } from '../../services/divelog.service';
import { DivelogFormComponent } from '../divelog-form/divelog-form.component';
import { DIVELOG_THEMES, DivelogThemeOption } from '../../models/divelog-theme';

@Component({
  selector: 'app-divelog-list-page',
  templateUrl: './divelog-list-page.component.html',
  styleUrl: './divelog-list-page.component.scss'
})
export class DivelogListPageComponent {

  isUserDivelogsLoading : boolean;
  userDivelogs: UserDivelog[] = [];
  themes: DivelogThemeOption[] = DIVELOG_THEMES;

  isDeleting: { [id: number]: boolean } = {};
  isEditMode: boolean = false;
  // TODO: sort comme certif: 
  // originalOrder: { id: number, displayOrder: number }[] = []; // Pour pouvoir stocke l'ordre initial
  // originalUserCertificates: UserDivelog[] = []; // Pour restaurer si cancel

  isAnimatingFadeOut = false;

  constructor(
    private divelogService: DivelogService,
    private modalService: ModalService,
    private animationService: AnimationService,
    private translateService: TranslateService,
    private flashMessageService: FlashMessageService,
  ) {
    this.isUserDivelogsLoading = true;
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    this.loadUserDivelogs();
  }

  private loadUserDivelogs(): void {
    this.divelogService.getCurrentUserDivelogs().subscribe({
      next: (divelogs) => {
        // TODO: sort comme certif:
        // this.userDivelogs = divelogs.sort((a, b) => a.displayOrder - b.displayOrder); // sortBy displayOrder
        this.userDivelogs = divelogs;
        this.isUserDivelogsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users divelogs', error);
        this.isUserDivelogsLoading = false;
      }
    });
  }

  // Récup url des Couvertures des divelogs:
  getThemeImage(themeId: string): string {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.imageUrl : '';
  }

  toggleEditMode() {
    if (!this.isEditMode) {
      // // Avant d'activer l'édition, on stocke l'ordre initial (pour comparer si modifs)
      // this.originalOrder = this.userCertificates.map(cert => ({
      //   id: cert.id,
      //   displayOrder: cert.displayOrder
      // }));
      // // Stocke une copie complète pour restaurer en cas d'annulation (revert aussi le fav)
      // this.originalUserCertificates = JSON.parse(JSON.stringify(this.userCertificates));
    } else {
      // this.saveCertificateOrder();
    }

    this.isEditMode = !this.isEditMode;
  }

  // revertReorderCertifs(): void {
  //   // Restaure la liste complète des certificats pour éviter l'erreur
  //   this.userCertificates = JSON.parse(JSON.stringify(this.originalUserCertificates));
  //   this.isEditMode = false;
  // }

  // saveCertificateOrder(): void {
  //   const updatedOrder = this.userCertificates.map((cert, index) => ({
  //     id: cert.id,
  //     displayOrder: index + 1
  //   }));

  //   // Vérifier si l’ordre a changé avant d’envoyer la requête (early return)
  //   if (JSON.stringify(this.originalOrder) === JSON.stringify(updatedOrder)) {
  //     console.log('No changes detected, skipping request.');
  //     return;
  //   }

  //   this.certificateService.updateUserCertificatesOrder(updatedOrder).subscribe({
  //     next: () => {
  //       this.flashMessageService.success('CERTIFS_REORDER_SUCCESS');
  //     },
  //     error: () => {
  //       this.flashMessageService.error('CERTIFS_REORDER_ERROR');
  //     },
  //   });
  // }

  openAddDivelogModal(): void {
    this.modalService.open(DivelogFormComponent, {
      modalIcon: "menu_book"
    }); 

    this.modalService.subscribeToClose((createdDivelog: UserDivelog) => {
      if (createdDivelog) {
        createdDivelog.diveCount = createdDivelog.diveCount ?? 0;
        this.userDivelogs = [...this.userDivelogs, createdDivelog];
        console.log("Nouvelle liste de userCertifs :", this.userDivelogs);
      }
    });
  }

  deleteDivelog(userDivelog: UserDivelog): void {

    // Activer le spinner pour ce certificat
    this.isDeleting[userDivelog.id] = true;

    this.divelogService.deleteUserDivelog(userDivelog.id).subscribe({
      next: () => {
        // Supprimer l'élément localement après la suppression réussie
        this.userDivelogs = this.userDivelogs.filter(
          divelog => divelog.id !== userDivelog.id
        );
        this.isDeleting[userDivelog.id] = false;
        console.log('Divelog deleted successfully');
      },
      error: (err) => {
        this.isDeleting[userDivelog.id] = false;
        console.error('Error while deleting divelog:', err);
      },
    });
  }

  // cdk drag-drop dans list certifs
  drop(event: CdkDragDrop<UserDivelog[]>) {
    moveItemInArray(this.userDivelogs, event.previousIndex, event.currentIndex);
  }
  
  trackByDivelogId(index: number, userDivelog: UserDivelog): number | string {
    return userDivelog.id || index;
  }

}

