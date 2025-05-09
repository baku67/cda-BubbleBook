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
import { DivelogConfirmationDeleteComponent } from '../divelog-confirmation-delete/divelog-confirmation-delete.component';

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
  // DisplayOrder: 
  originalOrder: { id: number, displayOrder: number }[] = []; // Pour pouvoir stocke l'ordre initial
  originalUserDivelogs: UserDivelog[] = []; // Pour restaurer si cancel

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
        this.userDivelogs = divelogs.sort((a, b) => a.displayOrder - b.displayOrder); // sortBy displayOrder
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
      // Avant d'activer l'édition, on stocke l'ordre initial (pour comparer si modifs)
      this.originalOrder = this.userDivelogs.map(divelog => ({
        id: divelog.id,
        displayOrder: divelog.displayOrder
      }));
      // Stocke une copie complète pour restaurer en cas d'annulation (revert aussi le fav)
      this.originalUserDivelogs = JSON.parse(JSON.stringify(this.userDivelogs));
    } else {
      this.saveDivelogsOrder();
    }

    this.isEditMode = !this.isEditMode;
  }

  openAddDivelogModal(): void {
    this.modalService.open(DivelogFormComponent, {
      modalIcon: "menu_book"
    }); 

    this.modalService.subscribeToClose((createdDivelog: UserDivelog) => {
      if (createdDivelog) {
        createdDivelog.diveCount = createdDivelog.diveCount ?? 0;
        this.userDivelogs = [createdDivelog, ...this.userDivelogs]; // Ajouté en premier de la liste (synchro backend displayOrder=1 et décal)
        console.log("Nouvelle liste de userDivelogs :", this.userDivelogs);
      }
    });
  }

  deleteUserDivelog(userDivelog: UserDivelog): void {
    // Activer le spinner pour ce divelog
    this.isDeleting[userDivelog.id] = true;

    // Modal de confirmation si diveCount > 0:
    if(userDivelog.diveCount > 0) {
      this.modalService.open(DivelogConfirmationDeleteComponent, {
        modalIcon: "warning",
        divelogToDelete: userDivelog
      })

      // (Gestion du mismatch du retappage dans le modal)
      this.modalService.subscribeToClose((choice: boolean) => {
        if(choice) {
          this.performDelete(userDivelog);
        }
        else {
          // Si on annule ou click out
          this.isDeleting[userDivelog.id] = false;
        }
      });
    }
    // Si diveCount = 0, suppression sans confirmation
    else {
      this.performDelete(userDivelog);
    }
  }

  private performDelete(userDivelog: UserDivelog) {
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

  // cdk drag-drop dans list divelogs
  drop(event: CdkDragDrop<UserDivelog[]>) {
    moveItemInArray(this.userDivelogs, event.previousIndex, event.currentIndex);
  }
  
  trackByDivelogId(index: number, userDivelog: UserDivelog): number | string {
    return userDivelog.id || index;
  }

  revertReorderDivelogs(): void {
    // Restaure la liste complète des divelogs pour éviter l'erreur
    this.userDivelogs = JSON.parse(JSON.stringify(this.originalUserDivelogs));
    this.isEditMode = false;
  }

  saveDivelogsOrder(): void {
    const updatedOrder = this.userDivelogs.map((divelog, index) => ({
      id: divelog.id,
      displayOrder: index + 1
    }));

    // Vérifier si l’ordre a changé avant d’envoyer la requête (early return)
    if (JSON.stringify(this.originalOrder) === JSON.stringify(updatedOrder)) {
      console.log('No changes detected, skipping request.');
      return;
    }

    this.divelogService.updateUserDivelogsOrder(updatedOrder).subscribe({
      next: () => {
        this.flashMessageService.success('DIVELOGS_REORDER_SUCCESS');
      },
      error: () => {
        this.flashMessageService.error('DIVELOGS_REORDER_ERROR');
      },
    });
  }

}

