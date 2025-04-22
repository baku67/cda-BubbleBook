import { Component } from '@angular/core';
import { UserProfil } from '../../../profil/models/userProfile.model';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute } from '@angular/router';
import { DivelogService } from '../../services/divelog.service';
import { UserDivelog } from '../../models/UserDivelog.model';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { DivelogFormComponent } from '../divelog-form/divelog-form.component';

@Component({
  selector: 'app-divelog-page',
  templateUrl: './divelog-page.component.html',
  styleUrl: './divelog-page.component.scss'
})
export class DivelogPageComponent {

  currentUser!: UserProfil | null;

  isAnimatingFadeOut = false;

  userDivelogs: UserDivelog[] = [];
  isUserDivelogsLoading: boolean = true;

  // Si on refait le même fonctionnement que certificates (juste pour dépacer ici)
  isEditMode: boolean = false;

  constructor(
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private divelogService: DivelogService,
    private modalService: ModalService,
  ) 
  {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });

    this.currentUser = this.route.snapshot.data['currentUser'];

    this.loadUserDivelogs();
  }

  private loadUserDivelogs(): void {
    this.divelogService.getCurrentUserDivelogs().subscribe({
      next: (divelogs) => {
        this.userDivelogs = divelogs; 
        this.isUserDivelogsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users divelogs', error);
        this.isUserDivelogsLoading = false;
      }
    });
  }

  openAddDivelogModal(): void {
    this.modalService.open(DivelogFormComponent, {
      modalIcon: "menu_book"
    }); // On a rien à lui passer

    // Ajout du divelog en dur (front) sans reload 
    this.modalService.subscribeToClose((createdDivelog: UserDivelog) => {
      if (createdDivelog) {
        this.userDivelogs = [...this.userDivelogs, createdDivelog];
        console.log("Nouvelle liste de userCertifs :", this.userDivelogs);
      }
    });
  }


}
