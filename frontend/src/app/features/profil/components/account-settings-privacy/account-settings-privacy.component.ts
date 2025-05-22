import { ChangeDetectorRef, Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { PrivacyOption, PrivacyOptionHelper } from '../../models/privacy-option';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-settings-privacy',
  templateUrl: './account-settings-privacy.component.html',
  styleUrl: './account-settings-privacy.component.scss'
})
export class AccountSettingsPrivacyComponent implements OnInit { 
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel; // pour ouvrir automatiquement le panel Privacy selon router.nav (ici depuis le privacy-summary de userProfil)

  @Input() user!: UserProfil;

  readonly panelOpenState = signal(false);

  isRequestSending = false;

  privacyOptionsEnum = PrivacyOption;
  privacyOptions = PrivacyOptionHelper.getOptions();

  selectedProfilPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;
  selectedLogBooksPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;
  selectedCertificatesPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;
  selectedGalleryPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userService: UserService, 
    private flashMessageService: FlashMessageService
  ) {}
  
  ngOnInit(): void {
    this.selectedProfilPrivacyOption = this.convertToPrivacyOption(this.user.profilPrivacy) || PrivacyOption.NO_ONE;
    this.selectedLogBooksPrivacyOption = this.convertToPrivacyOption(this.user.logBooksPrivacy) || PrivacyOption.NO_ONE;
    this.selectedCertificatesPrivacyOption = this.convertToPrivacyOption(this.user.certificatesPrivacy) || PrivacyOption.NO_ONE;
    this.selectedGalleryPrivacyOption = this.convertToPrivacyOption(this.user.galleryPrivacy) || PrivacyOption.NO_ONE;
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'privacy') {
        this.panel.open();
        this.cdr.detectChanges(); // stabilisation de la vue (marche sans mais bon)
      }
    });
  }

  private convertToPrivacyOption(value: string): PrivacyOption | undefined {
    return Object.values(PrivacyOption).find(option => option === value);
  }

  // Attention: Quand on revient sur profil = NO_ONE => IL FAUT toggle le reste en no_one aussi (ou alors bien géré le back)
  onPrivacyOptionChange(section: string, newOption: PrivacyOption): void {
    this.isRequestSending = true;
    
    this.userService.updateUserPrivacy({ ...this.user, [`${section}Privacy`]: newOption }).subscribe({
      next: (updatedUser: UserProfil) => {
        this.userService.updateCachedUser(updatedUser); // mis à jour du cache UserProfil
        this.user = updatedUser;
        this.isRequestSending = false;

        // Recalcule les options de confidentialité à partir de `this.user`
        this.selectedProfilPrivacyOption = this.convertToPrivacyOption(updatedUser.profilPrivacy) || PrivacyOption.NO_ONE;
        this.selectedLogBooksPrivacyOption = this.convertToPrivacyOption(updatedUser.logBooksPrivacy) || PrivacyOption.NO_ONE;
        this.selectedCertificatesPrivacyOption = this.convertToPrivacyOption(updatedUser.certificatesPrivacy) || PrivacyOption.NO_ONE;
        this.selectedGalleryPrivacyOption = this.convertToPrivacyOption(updatedUser.galleryPrivacy) || PrivacyOption.NO_ONE;
        
        this.flashMessageService.success('PROFILE_UPDATE_SUCCESS');
      },
      error: () => {
        this.isRequestSending = false;
        this.flashMessageService.error('PROFILE_UPDATE_ERROR');
      }
    });
  }
}
